interface Blog {
  id: string;
  title: string;
  content: string;
  published?: boolean;
  tags: string[];
  authorId?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:44975/api/v1';

export class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getPublicBlogs(page = 1, limit = 10): Promise<{ blogs: Blog[]; pagination: any; filters: any }> {
    return this.request(`/public/blogs?page=${page}&limit=${limit}`);
  }

  async searchBlogs(query: string, page = 1, limit = 10): Promise<{ blogs: Blog[]; pagination: any; filters: any }> {
    return this.request(`/public/blogs?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  async getBlogsByTag(tag: string, page = 1, limit = 10): Promise<{ blogs: Blog[]; pagination: any; filters: any }> {
    return this.request(`/public/blogs?tags=${encodeURIComponent(tag)}&page=${page}&limit=${limit}`);
  }

  async getBlogById(id: string): Promise<Blog> {
    return this.request(`/public/blog/${id}`);
  }

  async signup(data: { name: string; email: string; password: string }): Promise<{ token: string; user: any }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signin(data: { email: string; password: string }): Promise<{ token: string; user: any }> {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createBlog(data: { title: string; content: string; published: boolean; tags: string[] }, token: string): Promise<Blog> {
    return this.request('/blog', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: string, data: { title?: string; content?: string; published?: boolean; tags?: string[] }, token: string): Promise<Blog> {
    return this.request(`/blog/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: string, token: string): Promise<void> {
    return this.request(`/blog/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserBlogs(token: string): Promise<Blog[]> {
    return this.request('/blog/bulk', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();