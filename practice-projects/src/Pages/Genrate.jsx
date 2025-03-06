import axios from "axios";
import { useEffect, useState } from "react";

const GenerateContent = () => {
  const [question, setQuestion] = useState("");
  const [responseList, setResponseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/generate", {
        question,
      });
      const newResponse = res.data;

      setResponseList((prev) => [newResponse, ...prev]);
      setQuestion("");
    } catch (err) {
      console.error("There was an error:", err);
      setError("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousResponses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/responses");
      setResponseList(res.data);
    } catch (err) {
      console.error("Error fetching responses:", err);
      setError("Failed to load past responses.");
    }
  };

  useEffect(() => {
    fetchPreviousResponses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#4f8a1e] via-[#3bf6b8] to-[#73ea33] p-6">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">
          AI Content Generator
        </h1>

        <div className="relative w-full max-w-xl mx-auto mb-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            className="w-full px-5 py-3 text-white bg-white/20 border-none rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/70"
          />
        </div>

        <button
          onClick={fetchData}
          className="bg-purple-600 text-white px-6 py-3 font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Generating..." : "✨ Generate Response"}
        </button>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <div className="mt-8 w-full text-left">
          <h2 className="text-xl font-semibold text-white mb-4">
            📜 Previous Responses
          </h2>

          <div className="space-y-4">
            {responseList.length > 0 ? (
              responseList.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/20 p-5 rounded-lg shadow-lg transition-all hover:scale-[1.02]"
                >
                  <p className="text-red-300 font-medium">Q: {item.question}</p>
                  <p className="text-white mt-1">A: {item.response}</p>
                  <p className="text-red-300 text-sm mt-2">
                    ⏳ {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-200">No responses yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateContent;
