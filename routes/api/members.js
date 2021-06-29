const express = require('express');
const router = express.Router();
const members = require('../../Members');
const uuid = require('uuid');

const idFilter = req => member => member.id === +req.params.id;

// Get Single Member
router.get('/:id', (req, res) => {
  const found = members.some(idFilter(req));
  found ? res.json(members.filter(idFilter(req))) : res.status(400).json({ message: `No member with the id of ${req.params.id}` })
});

// Get All Members
router.get('/', (req, res) => res.json(members));

// Create Member

router.post('/', (req, res) => {
  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: 'Active'
  }

  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: `Please include a name and email` })
  }

  members.push(newMember);
  res.json(members);
});

// Update Member
router.put('/:id', (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    members.forEach((member, i) => {
      if (idFilter(req)(member)) {

        const updMember = { ...member, ...req.body };
        members[i] = updMember
        res.json({ msg: 'Member updated', updMember });
      }
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// Delete member
router.delete('/:id', (req, res) => {
  const found = members.some(idFilter(req));
  found ? res.json({
    message: `Member Deleted`,
    members: members.filter(member => !idFilter(req)(member))
  }) :
    res.status(400).json({ message: `No member with the id of ${req.params.id}` })
});


module.exports = router;