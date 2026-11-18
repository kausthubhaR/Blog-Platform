/**
 * Calculates estimated read time for a piece of content.
 * @param {string} content - The text content to analyze
 * @returns {number} Estimated read time in minutes (minimum 1)
 */
const calcReadTime = (content) => {
  if (!content || typeof content !== 'string') return 1;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime);
};

module.exports = calcReadTime;
