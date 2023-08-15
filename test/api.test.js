const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

//helper function to generate JWTs for testing apis that require Bearer Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 3600 });
};

//Some helper variables to set for the parameters in the apis
var EMAIL = "Aman@gmail.com";
var PASSWORD = "Aman@123";
var USER_ID = "64da87e46a550e0ffd3fe921";
var TO_FOLLOW_ID = "64da87ce6a550e0ffd3fe91f";
var TO_UNFOLLOW_ID = "64da87ce6a550e0ffd3fe91f";
var DELETE_POST_ID = "64dbd8d06306b0f8fec3b477";
var POST_ID = "64dbd5393a7f374e488719bc";
var authToken = generateToken(USER_ID);

chai.use(chaiHttp);
const expect = chai.expect;

//POSITIVE
describe("Authenticate API", () => {
  describe("POST /api/authenticate", () => {
    it("should return a JWT on authentication with correct credentials", (done) => {
      chai
        .request(app)
        .post("/api/authenticate")
        .send({ Email: EMAIL, Password: PASSWORD })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });
});

//NEGETIVE
describe("Authenticate API", () => {
  describe("POST /api/authenticate", () => {
    it("should return a error on authentication with incorrect credentials", (done) => {
      chai
        .request(app)
        .post("/api/authenticate")
        .send({ Email: "Aman@gmail", Password: "Aman3" })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property("error")
            .that.is.equal("Invalid Credentials");
          done();
        });
    });
  });
});

//POSITIVE
describe("Follow API", () => {
  describe("POST /api/follow/{id}", () => {
    it("should return success message on completion otherwise error message", (done) => {
      chai
        .request(app)
        .post(`/api/follow/${TO_FOLLOW_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("success");
          }
          done();
        });
    });
  });
});

// POSITIVE
describe("Unfollow API", () => {
  describe("POST /api/unfollow/{id}", () => {
    it("should return success message on completion otherwise error message", (done) => {
      chai
        .request(app)
        .post(`/api/unfollow/${TO_UNFOLLOW_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("success");
          }
          done();
        });
    });
  });
});

// POSITIVE
describe("User API", () => {
  describe("GET /api/user", () => {
    it("should return username, number of followers & followings", (done) => {
      chai
        .request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("Name");
          expect(res.body).to.have.property("Followers");
          expect(res.body).to.have.property("Followings");
          // }
          done();
        });
    });
  });
});

//NEGETIVE
describe("User API", () => {
  describe("GET /api/user", () => {
    it("should return error, for unauthenticated user access", (done) => {
      chai
        .request(app)
        .get("/api/user")
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });
});

// POSITIVE
describe("Create Posts API", () => {
  describe("POST /api/posts", () => {
    it("should return Post ID, Title, Description and Created Time", (done) => {
      chai
        .request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          Title: "Linked Lists",
          Description:
            "Linked Lists are created using structures and each node contain a value and address to the next node",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("Post_id");
          expect(res.body).to.have.property("Title");
          expect(res.body).to.have.property("Description");
          expect(res.body).to.have.property("CreatedAt");
          done();
        });
    });
  });
});

//NEGETIVE
describe("Create Posts API", () => {
  describe("POST /api/posts", () => {
    it("should return error for empty Title/Description while post creation", (done) => {
      chai
        .request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          Title: "",
          Description: "",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });
});

// POSITIVE
describe("Delete Posts API", () => {
  describe("DELETE api/posts/{id}", () => {
    it("should return success message on deletion", (done) => {
      chai
        .request(app)
        .delete(`/api/posts/${DELETE_POST_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          done();
        });
    });
  });
});

// POSITIVE
describe("Like Posts API", () => {
  describe("POST api/like/{id}", () => {
    it("should return success message on liking the post", (done) => {
      chai
        .request(app)
        .post(`/api/like/${POST_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          done();
        });
    });
  });
});

// POSITIVE
describe("Unlike Posts API", () => {
  describe("POST api/unlike/{id}", () => {
    it("should return success message on unliking the post", (done) => {
      chai
        .request(app)
        .post(`/api/unlike/${POST_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          done();
        });
    });
  });
});

// POSITIVE
describe("Add Comment API", () => {
  describe("POST /api/comment/{id}", () => {
    it("should add comment on the post with given id and return comment id", (done) => {
      chai
        .request(app)
        .post(`/api/comment/${POST_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ Comment: "Right Bro!" })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.to.have.status(200));
          expect(res.body).to.have.property("Comment_id");
          done();
        });
    });
  });
});

//NEGETIVE
describe("Add Comment API", () => {
  describe("POST /api/comment/{id}", () => {
    it("should return error on empty Comment field", (done) => {
      chai
        .request(app)
        .post(`/api/comment/${POST_ID}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ Comment: "" })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.to.have.status(400));
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });
});

// POSITIVE
describe("Get Posts by id API", () => {
  describe("GET /api/posts/{id}", () => {
    it("should fetch for a post with given id and return post with number of likes and comments populated", (done) => {
      chai
        .request(app)
        .get(`/api/posts/${POST_ID}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("ID");
          expect(res.body).to.have.property("OwnerId");
          expect(res.body).to.have.property("Title");
          expect(res.body).to.have.property("Description");
          expect(res.body).to.have.property("NumberOfLikes");
          expect(res.body).to.have.property("Likes");
          expect(res.body).to.have.property("NumberOfComments");
          expect(res.body).to.have.property("Comments");
          done();
        });
    });
  });
});

// POSITIVE
describe("Get all posts API", () => {
  describe("GET /api/all_posts", () => {
    it("should return all posts from the authenticated user sorted by post time", (done) => {
      chai
        .request(app)
        .get("/api/all_posts")
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          if (res.body.length > 0) {
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0]).to.have.property("title");
            expect(res.body[0]).to.have.property("desc");
            expect(res.body[0]).to.have.property("created_at");
            expect(res.body[0]).to.have.property("comments");
            expect(res.body[0]).to.have.property("likes");
          }
          done();
        });
    });
  });
});
