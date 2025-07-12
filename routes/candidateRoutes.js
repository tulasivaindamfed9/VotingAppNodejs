// express router helps in code readability and divide code into diff components => same like in front end react-router-dom
// importing express router from express
const express = require("express");
const router = express.Router();
// importing user model from user.js file to check fun checkAdminRole
const User = require("../models/user");
const Candidate = require("../models/candidate");

const { jwtAuthMiddleware } = require("./../jwt");

// function to check the person is admin or not
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user)
    if (user.role === "admin") return true;
  } catch (err) {
    return false;
  }
};

// POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    // only admin can post a candidate not a random person
    // checking person is admin or not by passing id
    // for no access to admin roles generally we use 403
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ message: "Sorry! Only Admin can post a candidate" });
    }

    // if admin, he can post a candidate
    const data = req.body; //assuming body-parser saves data in req.body

    // createe new person's document using mongoose model
    const newCandidte = new Candidate(data);

    // save newPerson to the database
    const response = await newCandidte.save();
    console.log("data saved");
    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update route to update(change) candidate details
router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    // only admin can update a candidate not a random person
    // checking person is admin or not by passing id
    if (!checkAdminRole(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Sorry! Only Admin can update a candidate" });
    }

    const candidateId = req.params.candidateId; //extract candidateId parameter from url '/:candidateId'
    const updatedCandidateData = req.body; //extracted candidate data based on id from body parser(req.body)

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true, //return the updated document
        runValidators: true, //run mongoose validation for candidate schema
      }
    );

    // if any error in response print error msg : candidate not found
    if (!response) {
      res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Invalid server error" });
  }
});

// delete route to delete a candidate
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    // only admin can delete a candidate not a random person
    // checking person is admin or not by passing id
    if (!checkAdminRole(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Sorry! Only Admin can post a candidate" });
    }

    const candidateId = req.params.candidateId; //extract id parameter from url '/:id'
    const response = await Candidate.findByIdAndDelete(candidateId);

    // if any error in response print error msg : candidate not found
    if (!response) {
      res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Invalid server error" });
  }
});

// let's start voting
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try {
    // checking candidate by his id
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Finding user by his id
    const user = await User.findById(userId);

    // if user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // admin cannot vote
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot vote" });
    }

    // user can vote only once
    if (user.isVoted) {
      return res.status(400).json({ message: "You already voted" });
    }

    // update the candidate document with no. of votes and voter id
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update user as voted
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal seerver error" });
  }
});

// counting no. of votes
router.get("/vote/count", async (req, res) => {
  try {
    // getting all candidates from candidates list
    const candidate = await Candidate.find().sort({ voteCount: "descending" });

    // map the candidates to only return their party name and vote count
    const voteRecord = candidate.map((each) => {
      return {
        party: each.party,
        voteCount: each.voteCount,
      };
    });

    res.status(200).json(voteRecord);
  } catch (err) {
    res.status(500).json({ error: "Internal seerver error" });
  }
});

module.exports = router;
