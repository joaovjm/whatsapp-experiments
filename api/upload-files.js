import supabase from "../helper/superBaseClient";

export const config = {
  api: { bodyParser: false }
};

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file;
    const buffer = fs.readFileSync(file.filepath);

    const { data, error } = await supabase
      .storage
      .from('chat-files')
      .upload(file.originalFilename, buffer, { upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { publicURL } = supabase.storage.from('chat-files').getPublicUrl(file.originalFilename);

    res.status(200).json({ url: publicURL });
  });
}
