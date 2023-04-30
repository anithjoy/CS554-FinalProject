const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient({});
client.connect().then(() => {});
const helper = require('../helper');
const {ticket : ticketData} = require("../data");

//PD
router
.route('/')
.get(async (req, res) => {
  try{
      const tickets = await ticketData.getTicketByUser(req.user.email);
      await client.hSet("ticket", req.user.email, JSON.stringify(tickets));
      res.json(tickets);
  }catch(e){
    if(typeof e !== 'object' || !('status' in e))
      res.status(500).json("Internal server error");
    else
      res.status(parseInt(e.status)).json(e.error);
    return;
  }

 })
.post(async (req, res) => {
    let data = req.body;
    data.companyId = req.user.companyId;
    data.creator = req.user.email;
    try{
      data = helper.ticket.isValidTicketCreationData(data)
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const createTicket = await ticketData.createTicket(data);
      await client.set(createTicket._id.toString(), JSON.stringify(createTicket));
      await client.del("ticket");
      res.json(createTicket);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
})

//PD
router
 .route('/:ticketId')
 .get(async (req, res) => {
    let ticketId;
    try{
        ticketId = helper.common.isValidId(req.params.ticketId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const ticket = await ticketData.getTicketById(ticketId);
      await client.set(ticket._id.toString(), JSON.stringify(ticket));
      res.json(ticket);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
 })
 .patch(async (req, res) => {
    let data = req.body;
    let ticketId;
    try{
      data = helper.ticket.isValidTicketUpdateData(data);
      ticketId = helper.common.isValidId(req.params.ticketId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const updateTicket = await ticketData.updateTicket(ticketId, data);
      await client.set(updateTicket._id.toString(), JSON.stringify(updateTicket));
      await client.del("ticket");
      res.json(updateTicket);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
 })

//Megh
router
  .route("/:ticketId/comment")
  .get(async (req, res) => {
    try{
      req.params.ticketId = helper.common.isValidId(req.params.ticketId);
      const comments = await ticketData.getCommentsByTicketId(req.params.ticketId);
      if(!comments) throw {status:500,error:'Could not get comments'};
      res.json(comments);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
      res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    
  })
  .post(async (req, res) => {
    try{
      req.params.ticketId = helper.common.isValidId(req.params.ticketId);
      req.body.text = helper.common.isValidString(req.body.text,'comment');
      if(req.body.document) req.body.document = helper.ticket.isValidDocument(req.body.document);

      const updatedTicket = await ticketData.createComment(req.params.ticketId ,req.body);
      res.json(updatedTicket);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
      res.status(500).json("Internal server error");
    else
      res.status(parseInt(e.status)).json(e.error);
    return;
    }
  });

//Anyone can pickup this
router
 .route("/:ticketId/comment/:commentId")
 .delete(async (req, res) => {
  try {
    let ticketId = req.params.ticketId;
    let commentId = req.params.commentId;

    ticketId = helper.common.isValidId(ticketId);
    commentId = helper.common.isValidId(commentId);

    await ticketData.deleteTicketComment(ticketId, commentId);
    return res.status(200).json("Removed");
  } catch (e) {
    if(typeof e !== 'object' || !('status' in e))
      res.status(500).json("Internal server error");
    else
      res.status(parseInt(e.status)).json(e.error);
    return;
  }
});

module.exports = router;
