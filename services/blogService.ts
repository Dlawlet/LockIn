import { db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

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
}

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
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
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
    const blogsRef = collection(db, 'blogs');
    const q = query(
      blogsRef, 
      where('featured', '==', true),
      orderBy('publishDate', 'desc'),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    
    const blogPosts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      blogPosts.push({ ...doc.data(), id: doc.id } as BlogPost);
    });
    
    return blogPosts;
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    throw new Error('Failed to fetch featured blog posts');
  }
};