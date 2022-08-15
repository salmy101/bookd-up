import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { cleanUpShelf, getBooksByISBN } from "../helpers/booksAPI";
import axios from "axios";
import "./profile.scss";
import { useNavigate, useParams, Link } from "react-router-dom";

import "./profile2.scss";
import profileimage from "./profileimage.png";
import profileimage2 from "./profileimage2.png";

const Profile = () => {
  const { id } = useParams()

  const { user } = useContext(UserContext);
  const [clubs, setClubs] = useState({});
  const [shelves, setShelves] = useState({});
  useEffect(() => {
    // if (!user) {
    //   navigate('/login');
    // }

    Promise.all([
      axios.get(`/api/users/${user && user.id}`),
      axios.get(`/api/users/${user && user.id}/clubs`),
      axios.get(`/api/users/${user && user.id}/shelves`),
    ]).then((res) => {
      // setUser(res[0].data.user);
      setClubs(res[1].data);

      // Send ISBNs to helper function and get back promises to get data from book API
      Promise.all([
        getBooksByISBN(res[2].data.current),
        getBooksByISBN(res[2].data.want),
        getBooksByISBN(res[2].data.have),
      ]).then((res) => {
        // Clean up the returned book data before setting state
        setShelves({
          current: cleanUpShelf(res[0]),
          want: cleanUpShelf(res[1]),
          have: cleanUpShelf(res[2]),
        });
      });
    });
  }, []);

  // const create = () => {
  //   navigate("/create")
  // }

  const getClubs = (clubs) => {
    return clubs.map((club) => {
      return (
        <div key={club.id} className="user-club-details">
          <div className="user-club-image">
            <img className="bookclub-image" src={profileimage2} />
          </div>
          <div className="user-details-box">
            <h4>{club.name}</h4>
            <p>{club.description}</p>
            <a className="invite" href="/">
              Visit The Club!
            </a>
          </div>
        </div>
      );
    });
  };

  const getShelfBooks = (shelf) => {
    return shelf.map((book, index) => {
      return (
        // <div key={index} className="user-shelves-container">
        <div key={index} className="user-shelves-card">
        <div>{<img src={book.imageLinks.thumbnail} alt="Shelf Book"/>}</div>
          <p><b>{book.title}</b> {`by ${book.authors[0]}`}</p>
        </div>
      // </div>
      );
    });
  };

  return (
    <section className=" profile-section">
      <div className="profile-container">
        <img className="profile-image" src={profileimage} />
        <h2 className="user-name">
          {user && user.first_name} {user && user.last_name}
        </h2>
        <span></span>
      </div>

      <div className="user-club-header">
        <h2 className="user-clubs">Created Clubs</h2>
      </div>
      <div className="user-club-section">
        {clubs.created && clubs.created.length > 0 && getClubs(clubs.created)}
      </div>

      <div className="user-club-header">
        <h2 className="user-clubs">Joined Clubs</h2>
      </div>
      <div className="user-club-section">
        {clubs.joined && clubs.joined.length > 0 && getClubs(clubs.joined)}
      </div>


      <div className="user-shelves-header">
        <h3 className="user-shelves">My Shelves</h3>
      </div>

      <div className="user-shelves-section">
        <h3>Currently Reading</h3>
        <div className="user-shelves-container">
        {(shelves.current && shelves.current.length > 0 && getShelfBooks(shelves.current)) || 'Not currently reading a book'}
          {/* <div className="user-shelves-card">First Card</div>
          <div className="user-shelves-card">Second Card</div>
          <div className="user-shelves-card">Third Card</div>
          <div className="user-shelves-card">Fourth Card</div>
          <div className="user-shelves-card">Fifth Card</div>
          <div className="user-shelves-card">Last card</div> */}
        </div>
      </div>
      <div className="user-shelves-section">
        <h3>Want to Read</h3>
        <div className="user-shelves-container">
        {(shelves.want && shelves.want.length > 0 && getShelfBooks(shelves.want)) || 'No books you want to read yet'}
        </div>
      </div>

      <div className="user-shelves-section">
        <h3>Have Read</h3>
      <div className="user-shelves-container">
        {(shelves.have && shelves.have.length > 0 && getShelfBooks(shelves.have)) || "No finished books yet"}
        </div>
      </div>
    </section>
  );
};

export default Profile;
