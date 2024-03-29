const common = require("./common");

const isValidStateName = (name) => {
  
  name = common.isValidString(name, "State Name");

  if (name.length === 0 || name.length > 50) {
    throw {
      status: 400,
      error: "Name must not be empty and should be less than 50 characters",
    };
  }

  if(name.length<4)
  throw {status: '400', error : 'less than 4 character name'};

  const nameRegex = /^[a-zA-Z\s]*$/;
  if (!nameRegex.test(name)) {
    throw { status: 400, error: "speical character not allowed" };
  }

  return name;
};

const isValidDescription = (description) => {
  
  description = common.isValidString(description, "State Description");

  if (description.length < 10 || description.length > 1000) {
    throw {
      status: 400,
      error: "Description must be between 10 and 1000 characters long",
    };
  }

  return description;
};

const isValidTransition = (transition) => {

  if (!Array.isArray(transition)) {
    throw { status: 400, error: "Transition must be an array" };
  }
  for(let t of transition){
    if(!common.isValidId(t)) throw{status:400,error:'invalid transition id'}
  }
  return transition;
};

const isValidData = (data) => {
  for(let key in data)
    {
        switch(key){
            case "name":
                data.name = isValidStateName(data.name);
                break;
            case "description":
                data.description = isValidDescription(data.description);
                break;
            case "transition":
                data.transition = isValidTransition(data.transition);
                break;
            default:
                throw {status: '400', error : `Invalid key - ${key}`};
            
        }
    }
    return data;
}

module.exports = { 
  isValidStateName, 
  isValidDescription, 
  isValidTransition,
  isValidData 
};