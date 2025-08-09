import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getBlogPost, toggleBlogLike } from "@/services/blogService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface BlogPost {
  id: string;
  title: string;
  content: string;
  shortDescription: string;
  category: string;
  author: string;
  authorAvatar?: string;
  publishDate: string;
  readTime: string;
  image: string;
  likes: number;
  comments: number;
  featured: boolean;
  tags: string[];
}

export default function ReadBlogPage() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    loadBlogPost();
  }, [id]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      if (id) {
        const post = await getBlogPost(id as string);
        setBlogPost(post);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLike = async () => {
    if (!blogPost) return;

    try {
      const newLikedState = !liked;

      // Mettre à jour l'état local immédiatement (optimistic update)
      setLiked(newLikedState);
      setBlogPost({
        ...blogPost,
        likes: blogPost.likes + (newLikedState ? 1 : -1),
      });

      // Mettre à jour la base de données
      await toggleBlogLike(blogPost.id, newLikedState);
    } catch (error) {
      console.error("Error updating like:", error);

      // Reverser l'état en cas d'erreur
      setLiked(!liked);
      setBlogPost({
        ...blogPost,
        likes: blogPost.likes + (liked ? 1 : -1),
      });
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share article");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tint} />
        <Text style={[styles.loadingText, { color: textSecondary }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  if (!blogPost) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <Ionicons name="document-text" size={64} color={textSecondary} />
        <Text style={[styles.errorText, { color: textPrimary }]}>
          Article non trouvé
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header avec image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: blogPost.image }} style={styles.headerImage} />

        {/* Navigation overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
              onPress={handleLike}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color={liked ? "#EF4444" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Category badge */}
        <View style={[styles.categoryBadge, { backgroundColor: tint }]}>
          <Text style={styles.categoryBadgeText}>{blogPost.category}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Article header */}
        <View
          style={[styles.articleHeader, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.title, { color: textPrimary }]}>
            {blogPost.title}
          </Text>

          <View style={styles.meta}>
            <View style={styles.authorInfo}>
              {blogPost.authorAvatar ? (
                <Image
                  source={{ uri: blogPost.authorAvatar }}
                  style={styles.authorAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.authorAvatarPlaceholder,
                    { backgroundColor: tint },
                  ]}
                >
                  <Text style={styles.authorInitial}>
                    {blogPost.author.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.authorMeta}>
                <Text style={[styles.authorName, { color: textPrimary }]}>
                  {blogPost.author}
                </Text>
                <View style={styles.articleMeta}>
                  <Text style={[styles.metaText, { color: textSecondary }]}>
                    {formatDate(blogPost.publishDate)}
                  </Text>
                  <Text style={[styles.metaText, { color: textSecondary }]}>
                    • {blogPost.readTime}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={16} color={textSecondary} />
                <Text style={[styles.statText, { color: textSecondary }]}>
                  {blogPost.likes}
                </Text>
              </View>
              {/* <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={16} color={textSecondary} />
                <Text style={[styles.statText, { color: textSecondary }]}>
                  {blogPost.comments}
                </Text>
              </View> */}
            </View>
          </View>
        </View>

        {/* Article content */}
        <View
          style={[styles.articleContent, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.content, { color: textPrimary }]}>
            {blogPost.content}
          </Text>
        </View>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <View
            style={[styles.tagsContainer, { backgroundColor: cardBackground }]}
          >
            <Text style={[styles.tagsTitle, { color: textPrimary }]}>Tags</Text>
            <View style={styles.tagsWrapper}>
              {blogPost.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: `${tint}20`, borderColor: tint },
                  ]}
                >
                  <Text style={[styles.tagText, { color: tint }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions footer */}
        <View
          style={[
            styles.actionsFooter,
            { backgroundColor: cardBackground, borderColor: border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: liked ? "#EF4444" : `${tint}20` },
            ]}
            onPress={handleLike}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "white" : tint}
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: liked ? "white" : tint },
              ]}
            >
              {liked ? "Aimé" : "Aimer"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${tint}20` }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={tint} />
            <Text style={[styles.actionButtonText, { color: tint }]}>
              Partager
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  articleHeader: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
    marginBottom: 20,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  authorInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  articleContent: {
    padding: 24,
    marginTop: 1,
  },
  content: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
  },
  tagsContainer: {
    padding: 24,
    marginTop: 1,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionsFooter: {
    flexDirection: "row",
    padding: 24,
    gap: 16,
    marginTop: 1,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
