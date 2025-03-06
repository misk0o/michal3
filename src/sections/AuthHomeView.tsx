// src/sections/AuthHomeView.tsx

import React from "react";
import '../styles/AuthHomeView.css'; // Import custom CSS file

interface AuthHomeViewProps {
  session: any;
  posts: any[];
}

const AuthHomeView: React.FC<AuthHomeViewProps> = ({ session, posts }) => {
  return (
    <div className="auth-home-container">
      <div className="content-container">
        {/* Welcome Text */}
        <h1 className="text-heading">Welcome, {session.user.name}</h1>
        
        {/* Posts Header */}
        <h2 className="text-subheading">Your Posts:</h2>

        {/* Posts Container */}
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="post-image"
                />
                <div className="post-caption">
                  <p>{post.caption}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts-message">You have no posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthHomeView;