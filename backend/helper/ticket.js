const common = require("./common");
const constant = require("../constant");

const isValidTicketName = (name) => {

    name = common.isValidString(name, "Ticket Name");
  
    if(name.length<4)
    throw {status: '400', error : 'less than 4 character name'};
  
    if(name.length>15)
        throw {status: '400', error : 'more than 15 character name'};
    return name;
}

const isValidTicketPriority = (priority) => {
    priority = common.isValidString(priority, "ticketPriority");

    for(let i=0;i<constant.PRIORITY.length;i++)
        if(priority.toLowerCase() === constant.PRIORITY[i].toLowerCase())
            return constant.PRIORITY[i];
    throw {status: '400', error : "Invalid ticket priority"};
}

const isValidTicketType = (type) => {
    type = common.isValidString(type, "ticketType");

    for(let i=0;i<constant.TICKET_TYPE.length;i++)
        if(type.toLowerCase() === constant.TICKET_TYPE[i].toLowerCase())
            return constant.TICKET_TYPE[i];
    throw {status: '400', error : "Invalid ticket type"};
}

const isValidDependedOnTickets = (dependedOnTickets) => {
    if(!Array.isArray(dependedOnTickets))
            throw {status: '400', error : `Invalid data type for dependedOnTickets field`};
    for(let i=0;i<dependedOnTickets.length;i++)
    {            
        dependedOnTickets[i] = common.isValidId(dependedOnTickets[i]);
    }
    return dependedOnTickets;    
}

const isValidTicketUpdateData = (data) =>{
    for(let i=0;i<constant.FORBIDDEN_FIELD_FOR_TICKET_UPDATE;i++)
        if(data[constant.FORBIDDEN_FIELD_FOR_TICKET_UPDATE[i]])
            throw {status: '400', error : `Invalid ${constant.FORBIDDEN_FIELD_FOR_TICKET_UPDATE[i]} field`};
    data = isValidTicketData(data);
    return data;
}

const isValidTicketCreationData = (data) =>{
    for(let i=0;i<constant.REQUIRE_FIELD_FOR_TICKET_CREATION.length;i++)
        if(!data[constant.REQUIRE_FIELD_FOR_TICKET_CREATION[i]])
            throw {status: '400', error : `Require ${constant.REQUIRE_FIELD_FOR_TICKET_CREATION[i]} field`};
    for(let i=0;i<constant.FORBIDDEN_FIELD_FOR_TICKET_CREATION.length;i++)
        if(data[constant.FORBIDDEN_FIELD_FOR_TICKET_CREATION[i]])
            throw {status: '400', error : `Invalid ${constant.FORBIDDEN_FIELD_FOR_TICKET_CREATION[i]} field`};
    data = isValidTicketData(data);
    return data;
}

const isValidTicketData = (data) =>{
    for(let key in data)
    {
        switch(key){
            case "companyId":
                data.companyId = common.isValidId(data.companyId);
                break;
            case "projectId":
                data.projectId = common.isValidId(data.projectId);
                break;
            case "type":
                data.type = isValidTicketType(data.type);
                break;
            case "priority":
                data.priority = isValidTicketPriority(data.priority);
                break;
            case "sprintId":
                data.sprintId = common.isValidId(data.sprintId);
                break;
            case "name":
                data.name = isValidTicketName(data.name);
                break;
            case "stateId":
                data.stateId = common.isValidId(data.stateId);
                break;
            case "creator":
                data.creator = common.isValidEmail(data.creator);
                break;
            case "assign":
                data.assign = common.isValidEmail(data.assign);
                break;
            case "watchers":
                data.watchers = common.isValidWatchers(data.watchers);
                break;
            case "expectedDate":
                data.expectedDate = common.isValidFutureDate(data.expectedDate);
                break;
            case "reopenDate":
                data.reopenDate = common.isValidPastDate(data.reopenDate);
                break;
            case "closeDate":
                data.closeDate = common.isValidPastDate(data.closeDate);
                break;
            case "dependedOnTickets":
                data.dependedOnTickets = isValidDependedOnTickets(data.dependedOnTickets);
                break;
            case "description":
                data.description = common.isValidDescription(data.description);
                break;
            default:
                throw {status: '400', error : `Invalid key - ${key}`};
            
        }
    }
    return data;
}

const isValidDocument = (document) =>{
    document = common.isValidString(document,'document');
    return document;
}
module.exports = {
    isValidTicketUpdateData,
    isValidTicketCreationData,
    isValidDocument
};