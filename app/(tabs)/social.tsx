import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import {
  BlogPost,
  getAllBlogPosts,
  getFeaturedBlogPosts,
} from "@/services/blogService";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SocialScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme colors
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterBlogPosts();
  }, [selectedCategory, blogPosts]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const [allPosts, featured] = await Promise.all([
        getAllBlogPosts(),
        getFeaturedBlogPosts(),
      ]);
      setBlogPosts(allPosts);
      setFeaturedPosts(featured);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      // En cas d'erreur, utiliser des tableaux vides
      setBlogPosts([]);
      setFeaturedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const [filteredArticles, setFilteredArticles] = useState<BlogPost[]>([]);

  const filterBlogPosts = async () => {
    try {
      if (selectedCategory === "all") {
        setFilteredArticles(blogPosts);
      } else {
        // Filtrer localement plutôt que refaire une requête
        const filtered = blogPosts.filter(
          (post) => post.category === selectedCategory
        );
        setFilteredArticles(filtered);
      }
    } catch (error) {
      console.error("Error filtering blog posts:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBlogPosts();
    setRefreshing(false);
  };

  const handleReadArticle = (article: BlogPost) => {
    router.push(`/read-blog?id=${article.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  type Article = {
    id: number;
    title: string;
    shortDescription: string;
    category: string;
    author: string;
    publishDate: string;
    readTime: string;
    image: string;
    likes: number;
    comments: number;
    featured: boolean;
  };

  // Définir les catégories en fonction de celles dans populate.tsx
  const categories = [
    { key: "all", label: "Tous", icon: "apps" },
    { key: "motivation", label: "Motivation", icon: "flame" },
    { key: "mindset", label: "Mindset", icon: "bulb" },
    { key: "productivite", label: "Productivité", icon: "checkmark-circle" },
    { key: "bienetre", label: "Bien-être", icon: "leaf" },
    { key: "habitudes", label: "Habitudes", icon: "repeat" },
  ];

  const ArticleCard = ({
    article,
    featured = false,
  }: {
    article: BlogPost;
    featured?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.articleCard,
        { backgroundColor: cardBackground, borderColor: border },
        featured && styles.featuredCard,
      ]}
      onPress={() => handleReadArticle(article)}
      activeOpacity={0.7}
    >
      {featured && (
        <View style={[styles.featuredBadge, { backgroundColor: tint }]}>
          <Ionicons name="star" size={12} color="white" />
          <Text style={styles.featuredText}>À la une</Text>
        </View>
      )}

      <Image source={{ uri: article.image }} style={styles.articleImage} />

      <View style={styles.articleContent}>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleCategory, { color: tint }]}>
            {categories.find((cat) => cat.key === article.category)?.label ||
              "Article"}
          </Text>
          <Text style={[styles.articleDate, { color: textSecondary }]}>
            {formatDate(article.publishDate)}
          </Text>
        </View>

        <Text
          style={[styles.articleTitle, { color: textPrimary }]}
          numberOfLines={2}
        >
          {article.title}
        </Text>

        <Text
          style={[styles.articleDescription, { color: textSecondary }]}
          numberOfLines={3}
        >
          {article.shortDescription}
        </Text>

        <View style={styles.articleFooter}>
          <View style={styles.articleAuthor}>
            <Ionicons name="person-circle" size={16} color={textSecondary} />
            <Text style={[styles.authorName, { color: textSecondary }]}>
              {article.author}
            </Text>
            <Text style={[styles.readTime, { color: textSecondary }]}>
              • {article.readTime}
            </Text>
          </View>

          <View style={styles.articleStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={14} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>
                {article.likes}
              </Text>
            </View>
            {/* <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={14} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>
                {article.comments}
              </Text>
            </View> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Juste avant le return, ajoutez :
  console.log("Featured posts count:", featuredPosts.length);
  console.log(
    "Featured posts:",
    featuredPosts.map((p) => ({
      id: p.id,
      title: p.title,
      featured: p.featured,
    }))
  );
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground }]}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>
          Communauté
        </Text>
        <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
          Inspiration et conseils pour rester motivé
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tint}
          />
        }
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                { borderColor: border },
                selectedCategory === category.key && {
                  backgroundColor: tint,
                  borderColor: tint,
                },
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.key ? "white" : textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.key
                        ? "white"
                        : textSecondary,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Featured Articles */}
        {selectedCategory === "all" && featuredPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              À la une
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredPosts.map((article) => (
                <View key={article.id} style={styles.featuredArticleWrapper}>
                  <ArticleCard article={article} featured={true} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Articles List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {selectedCategory === "all"
              ? "Tous les articles"
              : categories.find((cat) => cat.key === selectedCategory)?.label}
          </Text>

          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </View>
        {/* Load More */}
        <TouchableOpacity
          style={[styles.loadMoreButton, { backgroundColor: cardBackground }]}
        >
          <Ionicons name="refresh" size={20} color={tint} />
          <Text style={[styles.loadMoreText, { color: tint }]}>
            Charger plus d'articles
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    gap: 4,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  articleImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#E5E7EB",
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  articleDate: {
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleAuthor: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "500",
  },
  readTime: {
    fontSize: 12,
  },
  articleStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  featuredContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row", // Ajout important
  },
  featuredScrollView: {
    paddingLeft: 20,
  },
  featuredArticleWrapper: {
    width: width * 0.75,
    marginRight: 16,
  },
  featuredCard: {
    marginHorizontal: 0,
    marginBottom: 0,
  },

  // Pour les cartes normales
  articleCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
});
