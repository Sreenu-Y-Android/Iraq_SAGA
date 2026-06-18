const NewsArticle = require('../models/NewsArticle');

exports.getArticles = async (req, res) => {
  try {
    const {
      page        = 1,
      limit       = 20,
      search,
      district,
      category,
      source_type,
      language,
    } = req.query;

    // Never show articles from these domains in the UI
    const EXCLUDED_DOMAINS = ['indianexpress.com', 'news.google.com'];
    const filter = { source_domain: { $nin: EXCLUDED_DOMAINS } };

    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [
        { title: rx },
        { title_english: rx },
        { summary: rx },
        { summary_english: rx },
        { source_name: rx },
        { keywords_matched: rx },
      ];
    }

    if (district && district !== 'all') {
      filter['detected_location.district'] = district;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (source_type && source_type !== 'all') {
      filter.source_type = source_type;
    }
    if (language && language !== 'all') {
      filter.language = language;
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      NewsArticle.find(filter).sort({ published_date: -1 }).skip(skip).limit(limitNum).lean(),
      NewsArticle.countDocuments(filter),
    ]);

    res.json({
      articles,
      pagination: {
        page:  pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error('[NewsController] getArticles error:', err);
    res.status(500).json({ message: 'Failed to fetch news articles' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [total, byCategory, byLanguage, bySourceType] = await Promise.all([
      NewsArticle.countDocuments(),
      NewsArticle.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      NewsArticle.aggregate([{ $group: { _id: '$language', count: { $sum: 1 } } }]),
      NewsArticle.aggregate([{ $group: { _id: '$source_type', count: { $sum: 1 } } }]),
    ]);
    res.json({ total, byCategory, byLanguage, bySourceType });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news stats' });
  }
};
