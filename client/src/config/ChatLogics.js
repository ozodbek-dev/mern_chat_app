export const getSender = (loggedUser, users) => {
    return users[0]._id.toString() === loggedUser._id.toString() ? users[1].name : users[0].name
}
export const getSenderFull = (loggedUser, users) => {
    return users[0]._id.toString() === loggedUser._id.toString() ? users[1] : users[0]
}