import { pool } from "../config/dbConnect.mjs";
import { SYSTEM_PROMPTS } from "./../utils/systemPrompt.mjs"
import openAI from "./../config/openAIConnect.mjs"
import { config } from "dotenv";
config();

const CHAT_GPT_MODEL = process.env.CHAT_GPT_MODEL || "gpt-5"

export const getAIResponseService = async ({ input, type }) => {
  try {
    const systemPrompt = SYSTEM_PROMPTS[type];
    let responseData = null;
    while (responseData === null) {
      const { data } = await aiHelper({ systemPrompt, input })
      console.log(data);
      if (data !== null) {
        responseData = data;
      }
    }

    return {
      data: responseData
    }

  } catch (err) {
    throw err;
  }
}

export const saveHistoryService = async ({ input, type, output, userId }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO history(user_id, type, input, output) VALUES (?, ?, ?, ?)`,
      [userId, type, input, output]
    );

    await connection.commit();
  } catch (err) {
    try {
      await connection.rollback();
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr);
    }
    throw err;
  } finally {
    connection.release();
  }
}

const aiHelper = async ({ input, systemPrompt }) => {
  try {
    console.log("hello")
    const aiResponse = await openAI.chat.completions.create({
      model: CHAT_GPT_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        }, {
          role: "user",
          content: input
        }
      ]
    })

    const rawContent = aiResponse?.choices?.[0]?.message?.content;
    if (!rawContent) return { data: null };

    // Robust extraction: handle object content or stringified JSON with arbitrary keys.
    let extracted = null;

    if (typeof rawContent === "object" && rawContent !== null) {
      // If object has `text` use it. Otherwise pick the first string value.
      if (typeof rawContent.text === "string") {
        extracted = rawContent.text;
      } else {
        const vals = Object.values(rawContent).filter(v => typeof v === "string");
        if (vals.length) extracted = vals[0];
        else extracted = JSON.stringify(rawContent);
      }
    } else if (typeof rawContent === "string") {
      const s = rawContent.trim();

      // Try parsing whole string as JSON
      try {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === "object") {
          if (typeof parsed.text === "string") extracted = parsed.text;
          else {
            const vals = Object.values(parsed).filter(v => typeof v === "string");
            if (vals.length) extracted = vals[0];
            else extracted = JSON.stringify(parsed);
          }
        }
      } catch (e) {
        // If JSON.parse fails, try to extract a JSON substring
        const jsonMatch = s.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed && typeof parsed === "object") {
              if (typeof parsed.text === "string") extracted = parsed.text;
              else {
                const vals = Object.values(parsed).filter(v => typeof v === "string");
                if (vals.length) extracted = vals[0];
                else extracted = JSON.stringify(parsed);
              }
            }
          } catch (e2) {
            // ignore
          }
        }

        // Try simple regex for text: "text": "..."
        if (!extracted) {
          const textMatch = s.match(/"?text"?\s*[:=]\s*"([^"]+)"/i) || s.match(/"?text"?\s*[:=]\s*'([^']+)'/i);
          if (textMatch) extracted = textMatch[1];
        }

        // Fallback to the whole string
        if (!extracted) extracted = s;
      }
    } else {
      // last resort
      extracted = String(rawContent);
    }

    // Ensure string result
    if (extracted === null || extracted === undefined) return { data: null };
    if (typeof extracted !== "string") extracted = String(extracted);

    // Clean surrounding quotes and unescape common escape sequences.
    let cleaned = extracted.trim();

    // If the whole string is a JSON-encoded string (e.g. "..."), parse it to unescape
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      try {
        const parsed = JSON.parse(cleaned);
        if (typeof parsed === 'string') cleaned = parsed;
        else if (parsed && typeof parsed === 'object') {
          // extract text or first string value
          if (typeof parsed.text === 'string') cleaned = parsed.text;
          else {
            const vals = Object.values(parsed).filter(v => typeof v === 'string');
            if (vals.length) cleaned = vals[0];
            else cleaned = JSON.stringify(parsed);
          }
        }
      } catch (e) {
        // ignore parse error, fall through
      }
    } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
      // strip single quotes and unescape common sequences
      cleaned = cleaned.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
    }

    // If cleaned looks like JSON object, parse and extract
    if ((cleaned.startsWith('{') || cleaned.startsWith('[')) && (cleaned.endsWith('}') || cleaned.endsWith(']'))) {
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.text === 'string') cleaned = parsed.text;
          else {
            const vals = Object.values(parsed).filter(v => typeof v === 'string');
            if (vals.length) cleaned = vals[0];
            else cleaned = JSON.stringify(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // Final unescape of common sequences
    cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');

    // Trim again
    cleaned = cleaned.trim();

    return { data: cleaned };
  } catch (err) {
    throw err;
  }
}