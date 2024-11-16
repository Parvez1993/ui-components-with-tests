import React, { useState, useEffect } from "react"; // Add React import if not already present
function Pagination() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/posts?skip=${page}&limit=10`
        );
        const data = await response.json();
        console.log(data);
        setData(data?.posts);
        setTotal(data?.total);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {data?.map((post) => (
          <div
            role="article" // Added role for testing
            key={post.id}
            className="max-w-lg h-full flex flex-col rounded overflow-hidden bg-gray-200 shadow-xl p-4"
          >
            <h2 className="font-bold text-lg line-clamp-1">{post.title}</h2>
            <p className="flex-grow mt-2 text-gray-600 line-clamp-3">
              {post.body}
            </p>
          </div>
        ))}
      </div>
      <div className="flex my-12">
        {Array.from({ length: Math.ceil(total / 10) }, (_, index) => (
          <button // Changed from div to button
            key={index}
            data-testid={`page-button-${index}`} // Added test id
            className="p-2 border border-gray-800 cursor-pointer"
            onClick={() => setPage(index)}
            aria-label={`Page ${index + 1}`} // Added aria-label
            role="button" // Added explicit role
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pagination;
