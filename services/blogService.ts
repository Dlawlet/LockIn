import { db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs, increment, orderBy, query, updateDoc, where } from 'firebase/firestore';

export interface BlogPost {
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
  createdAt: string;
  updatedAt: string;
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const blogRef = doc(db, 'blogs', id);
    const blogDoc = await getDoc(blogRef);
    
    if (blogDoc.exists()) {
      return { ...blogDoc.data(), id: blogDoc.id } as BlogPost;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
};

export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(
      blogsRef, 
      where('category', '==', category),
      orderBy('publishDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const blogPosts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      blogPosts.push({ ...doc.data(), id: doc.id } as BlogPost);
    });
    
    return blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

export const getFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // SOLUTION 1: Requête simple sans orderBy (recommandée)
    const blogsRef = collection(db, 'blogs');
    const q = query(
      blogsRef, 
      where('featured', '==', true),
      //limit(5)
    );
    const querySnapshot = await getDocs(q);
    
    const blogPosts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      blogPosts.push({ ...doc.data(), id: doc.id } as BlogPost);
    });
    
    // Trier côté client par date
    const sortedPosts = blogPosts.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
    
    return sortedPosts;
  } catch (error: any) {
    console.error('Error fetching featured blog posts:', error);
    
    // Fallback: utiliser le filtrage local si erreur
    const allBlogs = await getAllBlogPosts();
    return allBlogs.filter(blog => blog.featured === true).slice(0, 5);
  }
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, orderBy('publishDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const blogPosts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      blogPosts.push({ ...doc.data(), id: doc.id } as BlogPost);
    });
    
    return blogPosts;
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    
    // Si la collection n'existe pas, retourner un tableau vide
    if (error.code === 'failed-precondition' || error.code === 'not-found') {
      return [];
    }
    
    throw new Error('Failed to fetch blog posts');
  }
};

export const toggleBlogLike = async (blogId: string, liked: boolean): Promise<void> => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      likes: increment(liked ? 1 : -1),
      lastInteraction: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};