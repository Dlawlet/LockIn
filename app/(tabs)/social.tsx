import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

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
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Mock data - remplacer par API plus tard
  const mockArticles = [
    {
      id: 1,
      title: "Comment rester motivé pendant 30 jours",
      shortDescription:
        "Découvrez les 5 stratégies psychologiques qui vous aideront à maintenir votre motivation sur le long terme.",
      category: "motivation",
      author: "Dr. Marie Dubois",
      publishDate: "2024-01-15",
      readTime: "5 min",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
      likes: 127,
      comments: 23,
      featured: true,
    },
    {
      id: 2,
      title: "La science derrière les habitudes",
      shortDescription:
        "Plongez dans les mécanismes neurologique qui régissent la formation des habitudes et apprenez à les exploiter.",
      category: "science",
      author: "Prof. Jean Martin",
      publishDate: "2024-01-12",
      readTime: "8 min",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      likes: 89,
      comments: 15,
      featured: false,
    },
    {
      id: 3,
      title: "Success Story: De 0 à 100 jours de méditation",
      shortDescription:
        "L'histoire inspirante de Sarah qui a transformé sa vie grâce à la méditation quotidienne avec LockIn.",
      category: "success",
      author: "Sarah L.",
      publishDate: "2024-01-10",
      readTime: "4 min",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
      likes: 203,
      comments: 45,
      featured: true,
    },
    {
      id: 4,
      title: "Gérer les échecs et rebondir",
      shortDescription:
        "Pourquoi échouer fait partie du processus et comment transformer vos échecs en apprentissage.",
      category: "mindset",
      author: "Alex Thompson",
      publishDate: "2024-01-08",
      readTime: "6 min",
      image:
        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=200&fit=crop",
      likes: 156,
      comments: 32,
      featured: false,
    },
    {
      id: 5,
      title: "Les meilleurs moments pour valider",
      shortDescription:
        "Analyse des données de 10,000 utilisateurs pour déterminer les créneaux horaires les plus efficaces.",
      category: "tips",
      author: "Équipe LockIn",
      publishDate: "2024-01-05",
      readTime: "3 min",
      image:
        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=200&fit=crop",
      likes: 92,
      comments: 18,
      featured: false,
    },
    {
      id: 6,
      title: "Choisir sa cause caritative",
      shortDescription:
        "Guide complet pour sélectionner l'œuvre caritative qui vous motivera le plus dans votre démarche.",
      category: "guide",
      author: "Marie Conscience",
      publishDate: "2024-01-03",
      readTime: "7 min",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
      likes: 74,
      comments: 12,
      featured: false,
    },
  ];

  const categories = [
    { key: "all", label: "Tout", icon: "grid" },
    { key: "motivation", label: "Motivation", icon: "flash" },
    { key: "science", label: "Science", icon: "flask" },
    { key: "success", label: "Success", icon: "trophy" },
    { key: "mindset", label: "Mindset", icon: "bulb" },
    { key: "tips", label: "Conseils", icon: "lightbulb" },
    { key: "guide", label: "Guides", icon: "book" },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? mockArticles
      : mockArticles.filter((article) => article.category === selectedCategory);

  const featuredArticles = mockArticles.filter((article) => article.featured);

  const onRefresh = () => {
    setRefreshing(true);
    // Simuler le rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleReadArticle = (article: { title: any }) => {
    console.log("Open article:", article.title);
    // Navigation vers l'article détaillé
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

  const ArticleCard = ({
    article,
    featured = false,
  }: {
    article: Article;
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
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={14} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>
                {article.comments}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        {selectedCategory === "all" && featuredArticles.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              À la une
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredArticles.map((article) => (
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
  featuredContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredArticleWrapper: {
    width: width * 0.8,
  },
  articleCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  featuredCard: {
    marginHorizontal: 0,
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
});
