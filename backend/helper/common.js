const { ObjectId } = require("mongodb");

const isValidString = (string, parameter) => {
  if (!string)
    throw {
      status: "400",
      error: `You must provide an ${parameter} to search for`,
    };
  if (typeof string !== "string")
    throw { status: "400", error: `${parameter} must be a string` };
  string = string.trim();
  if (string.length === 0)
    throw {
      status: "400",
      error: `${parameter} cannot be an empty string or just spaces`,
    };
  return string;
};

const isValidId = (id) => {
  id = isValidString(id, "ID");
  if (!ObjectId.isValid(id))
    throw { status: "400", error: "Invalid object ID" };
  return id;
};

const isValidEmail = (email) => {
  email = isValidString(email, "Email");
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    throw { status: "400", error: "Invalid Email" };
  return email.toLowerCase();
};

const isValidUserName = (inputName) => {
  inputName = isValidString(inputName, "Name");
  let name = inputName.split(" ");
  if (name.length != 2) throw { status: 400, error: "Invalid name" };
  if (name[0].length < 3)
    throw { status: "400", error: "First name should be atleast 3 character" };
  if (name[1].length < 3)
    throw { status: "400", error: "Last name should be atleast 3 character" };
  if (
    name[0].match(/^[^a-zA-Z0-9]+$/) ||
    (name[0].replace(/[^a-zA-Z0-9 ]/g, "").length !== name[0].length &&
      name[0].replace(/[^a-zA-Z0-9 ]/g, "").length !== name[0].length - 1)
  )
    throw { status: "400", error: "Invalid first name" };
  if (
    name[1].match(/^[^a-zA-Z0-9]+$/) ||
    (name[1].replace(/[^a-zA-Z0-9 ]/g, "").length !== name[1].length &&
      name[1].replace(/[^a-zA-Z0-9 ]/g, "").length !== name[1].length - 1)
  )
    throw { status: "400", error: "Invalid last name" };
  if (!name[0].match(/^[a-z.'-]+$/i))
    throw { status: "400", error: "Invalid first name" };
  if (!name[1].match(/^[a-z.'-]+$/i))
    throw { status: "400", error: "Invalid last name" };
  return inputName;
};

const isValidPastDate = (time) => {
  if (!time) throw { status: "400", error: "No date provided" };
  time = new Date(time);
  let today = new Date();
  if (time === "Invalid Date" || (time.getYear() > today.getYear() || time.getMonth() > today.getMonth() || time.getDate() >today.getDate()))
    throw { status: "400", error: "Invalid date" };
  if (time === "Invalid Date" || time.getYear() < today.getYear() - 2)
    throw { status: "400", error: "Can not be older than two years" };
  return time;
};

const isValidFutureDate = (time) => {
  if (!time) throw { status: "400", error: "No date provided" };
  time = new Date(time);
  let today = new Date();
  if (time === "Invalid Date" || (time.getYear() < today.getYear() || time.getMonth() < today.getMonth() || time.getDate() < today.getDate()))
    throw { status: "400", error: "Invalid date" };
  if (time === "Invalid Date" || time.getYear() > today.getYear() + 2)
    throw { status: "400", error: "Can not be more than two years newer" };
  return time;
};

const isValidDate = (time) => {
  if (!time) throw { status: "400", error: "No date provided" };
  time = new Date(time);
  let today = new Date();
  if (time == "Invalid Date")
    throw { status: "400", error: "Invalid date" };
  if (time.getYear() < today.getYear() - 2 || time.getYear() > today.getYear() + 2)
    throw { status: "400", error: `provide data in ${today.getYear()-2} to ${today.getYear()+2} year time frame` };
  return time;
};

const isValidWatchers = (watchers) => {

  if(!Array.isArray(watchers))
          throw {status: '400', error : `Invalid data type for watchers`};
  for(let i=0;i<watchers.length;i++)
  {            
      watchers[i] = isValidEmail(watchers[i]);
  }
  return watchers;
};
const isValidPassword = (password) => {
  if (
    !password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/)
  )
    throw { status: "400", error: "Invalid Password" };
  return password;
};

const isValidDescription = (description) => {
  
  description = isValidString(description, "Description");

  if (description.length < 10 || description.length > 1000) {
    throw {
      status: 400,
      error: "Description must be between 10 and 1000 characters long",
    };
  }

  return description;
};

module.exports = {
  isValidString,
  isValidId,
  isValidEmail,
  isValidUserName,
  isValidPastDate,
  isValidFutureDate,
  isValidDate,
  isValidWatchers,
  isValidPassword,
  isValidDescription
};
