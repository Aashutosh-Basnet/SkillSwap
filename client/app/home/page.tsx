"use client";
import Footer from "../components/Footer";
import CategoryFilter from "../components/home/CategoryFilter";
import FeaturedEvent from "../components/home/FeaturedEvent";
import Header from "../components/home/Header";
import PopularCourses from "../components/home/PopularCourses";
import SearchBar from "../components/home/SearchBar";
import TopAuthors from "../components/home/TopAuthors";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      
      {/* Hero Section with Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-indigo-600/5"></div>
        <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-3xl p-8 shadow-xl border border-white/20">
            <Header />
            
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>

          {/* Main content grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Main column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-3xl p-6 shadow-lg border border-white/20">
                <CategoryFilter />
              </div>
              <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-3xl p-8 shadow-lg border border-white/20">
                <PopularCourses />
              </div>
            </div>

            {/* Right/Sidebar column */}
            <div className="space-y-8">
              <FeaturedEvent />
              <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-3xl p-6 shadow-lg border border-white/20">
                <TopAuthors />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home; 