import React, { useEffect, useState } from "react";
import Blog from "../components/Blog";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import Footer from "../components/Footer";
import api from "../../api/posts";
import LoadingPage from "../components/Loading";

const Blogs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await api.get("/");
        const resData = response.data;
        setPosts(resData);
        setSearch(resData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setIsLoading(false);
      }
    };
    getPosts();
  }, []);

  const checkCategory = () => {
    const categories = document.querySelectorAll('#categories')
    categories.forEach(category =>{
      if (category.textContent === search){
        return true
      }else {
        return false
      }
    })
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header page="Blogs" data={posts} dataChange={setSearch} />
      <Chatbot />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="md:grid-cols-[220px_1fr] pt-10 flex-grow md:grid md:items-start py-4 flex flex-col items-center">
          <ul className="mx-5 my-12 hidden flex-col gap-2 font-semibold md:flex">
            <li className="text-2xl font-bold">All Categories</li>
            <li onClick={() => setSearch("")}>All Blogs</li>
            <li onClick={() => setSearch("Technology")}>Technology</li>
            <li onClick={() => setSearch("Art")}>Art</li>
            <li onClick={() => setSearch("Education")}>Education</li>
            <li onClick={() => setSearch("Nutrition")}>Nutrition</li>
            <li onClick={() => setSearch("Fashion")}>Fashion</li>
            <li onClick={() => setSearch("Music")}>Music</li>
            <li onClick={() => setSearch("Uncatagorized")}>Uncatagorized</li>
          </ul>
          <div className="blogs flex-grow grid grid-cols-1 gap-4 bg-gray-300 px-2 md:px-8 md:py-3 py-1">
            {search.map((post) => {
              return (
                <Blog
                  name={post.authorId.name}
                  date={post.createdAt}
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  category={post.category}
                  body={post.content}
                  comments={post.comments}
                  profilePicture={post.authorId.profilePicture}
                  img={post.image}
                />
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Blogs;
