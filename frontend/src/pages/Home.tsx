import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export const Home: FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-yellow-500 border-b border-gray-900 h-full flex flex-col justify-center">
        <div className="medium-container py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="medium-hero-title mb-8">
                Human<br />
                stories & ideas
              </h1>
              <p className="medium-hero-subtitle mb-12">
                A place to read, write, and deepen your understanding
              </p>
              <Link to="/signup" className="medium-button-primary inline-block">
                Start reading
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-gray-900 rounded-lg opacity-10"></div>
                <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full opacity-20"></div>
                <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-lg opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
