export default () => {
  try {
    return {
      status: true,
      date: Date.now(),
    };
  } catch (error) {
    console.log("error");
  }
};
