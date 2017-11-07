//Model 
var locations = [
  {
    title: "Dharmasthala",
    placeId: "ChIJ12TYLXzIpDsRVkl7w7cESZw",
    position: {
      lat: 12.95033,
      lng: 75.38053119999999
    }
  },
  {
    title: "Kukke Subrahamanya",
    placeId: "ChIJcS7UXR1uqDsRENF-BOtYAME",
    position: {
      lat: 12.6637167,
      lng: 75.61585599999999
    }
  },
  {
    title: "Murdeshwar",
    placeId: "ChIJre3gktFGvDsR4e9TZr0WxYc",
    position: {
      lat: 14.093993,
      lng: 74.4898633
    }
  },
  {
    title: "Jog Falls",
    placeId: "ChIJSUiRpLsNvDsR-xP-fS3cobE",
    position: {
      lat: 14.2294389,
      lng: 74.81252289999999
    }
  },
  {
    title: "Mysore Palace",
    placeId: "ChIJ-aH5AxFwrzsRDdokoeK6f8M",
    position: {
      lat: 12.2958104,
      lng: 76.6393805
    }
  },
  {
    title: "Udupi",
    placeId: "ChIJmzCEem27vDsRhS_6-dGlMfw",
    position: {
      lat: 13.3411848,
      lng: 74.75198349999999
    }
  }

];


var map, service, largeInfowindow, bounds;
var markers = [];