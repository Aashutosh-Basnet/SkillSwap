"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BottomNav from "../components/home/BottomNav";
import CategoryFilter from "../components/home/CategoryFilter";
import FeaturedEvent from "../components/home/FeaturedEvent";
import Header from "../components/home/Header";
import PopularCourses from "../components/home/PopularCourses";
import SearchBar from "../components/home/SearchBar";
import TopAuthors from "../components/home/TopAuthors";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4 lg:p-8">
        <Header />
        <div className="mt-4">
          <SearchBar />
        </div>
        <div className="mt-4">
          <CategoryFilter />
        </div>
        <div className="mt-6">
          <FeaturedEvent />
        </div>
        <div className="mt-6">
          <PopularCourses />
        </div>
        <div className="mt-6">
          <TopAuthors />
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default HomePage;
