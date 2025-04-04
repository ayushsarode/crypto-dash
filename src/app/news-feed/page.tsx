"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineSource } from "react-icons/md";
import { HiClock } from "react-icons/hi";
import Image from "next/image";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
  created_at: string;
  categories: string[];
}

const NewsCard: React.FC<{ article: NewsArticle; index: number }> = ({ article, index }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate description to limit length
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-500/20 hover:border-indigo-400/50 shadow-md hover:shadow-indigo-900/20 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="relative h-40 overflow-hidden">
          {article.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-news.jpg"; // Fallback image
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
              <span className="text-indigo-300 text-xl font-light">coindash</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-3 left-3 flex gap-2">
  {article.categories && article.categories.length > 0 
    ? article.categories.slice(0, 2).map((category, idx) => (
        <span 
          key={idx} 
          className="text-xs px-2 py-1 rounded-full bg-indigo-800/70 text-white backdrop-blur-sm"
        >
          {category}
        </span>
      ))
    : null
  }
</div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-indigo-100/80 text-sm flex-grow mb-3">
            {truncateDescription(article.description)}
          </p>
          <div className="flex justify-between items-center text-xs text-indigo-300 mt-auto">
            <div className="flex items-center gap-1">
              <MdOutlineSource />
              <span>{article.source}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiClock />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 text-center text-indigo-100 bg-indigo-900/70 hover:bg-indigo-700/80 transition duration-300 flex items-center justify-center gap-2"
        >
          <span>Read Full Article</span>
          <FaExternalLinkAlt size={12} />
        </a>
      </div>
    </motion.div>
  );
};

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: In production, you should use an API route to hide your API key
      const response = await fetch(
        `https://api.coingecko.com/api/v3/news?page=${page}&per_page=9`,
        {
          headers: {
            // You would need to get a CoinGecko API key for production use
            // "x-cg-api-key": "YOUR_API_KEY",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setNews(prevNews => page === 1 ? data.data : [...prevNews, ...data.data]);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Please try again later.");
      
      // If API is unavailable, load mock data for development
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="w-full py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Latest Crypto <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 text-transparent bg-clip-text">News</span>
          </motion.h2>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Stay updated with the latest developments, trends, and stories from the cryptocurrency world.
          </p>
        </div>
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {!loading && news.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="px-6 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/80 text-white font-medium backdrop-blur-sm border border-indigo-500/30 shadow-md transition-all duration-300"
            >
              Load More News
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};


export default NewsFeed;