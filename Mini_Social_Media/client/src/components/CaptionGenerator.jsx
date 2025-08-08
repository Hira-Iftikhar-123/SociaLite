import { useState } from 'react';
import axios from 'axios';

function CaptionGenerator() {
  const [mood, setMood] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/caption', { mood });
      setCaption(res.data.caption);
    } catch (err) {
      console.error('Error generating caption', err);
      setCaption('Failed to generate caption');
    }
    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold mb-2">AI Caption Generator</h2>
      <input
        type="text"
        placeholder="Enter a mood (e.g., happy, calm)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="input-field mb-6"
      />
      <button onClick={handleGenerate} className="btn-primary">
  {loading ? 'Generating...' : 'Generate Caption'}
</button>

      {caption && (
        <p className="mt-4 text-sm bg-dark-700 p-2 rounded">{caption}</p>
      )}
    </div>
  );
}

export default CaptionGenerator;