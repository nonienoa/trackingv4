import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import build from 'redux-object';
import normalize from 'json-api-normalizer';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://fmdelivery.koklass.com/api/v1';
// const COMPRESS_API = 'http://10.10.10.173:9090';
const COMPRESS_API = 'http://13.234.33.168:9091';
// const API_ROOT = 'https://fmdelivery.koklass.com/api/v1';
const FOODMANDU_API_ROOT = 'https://system-server.chotobato.com/proxy?url=https://fmdelapp.azurewebsites.net/api';
// const NODE_API_ROOT = 'http://localhost:3032';
const NODE_API_ROOT = 'https://fmtracking-api.koklass.com';
const NODE_TOKEN_SERVER = 'https://trackme-api.koklass.com'
// const NODE_API_ROOT = 'http://localhost:3032';
const EK_DEVLIVERY_POINT = 'https://fmtracking-api.koklass.com';
const DELIVERY_API = 'https://delivery.boafresh.com/api/v1';

const DASHBOARD_API = 'https://tracking-system.chotobato.com/api/v1';

const BESTROUTE_API = 'https://bestroute.chotobato.com/api/v1';

const CMS_API = 'https://tracking-cmsapi.chotobato.com/v1';

const LOCATION_API = 'https://api.pointnemo.info/api/v2'

const responseBody = res => res.body;

const tokenPlugin = req => {
  req.set('key', `5RvAycN87yvBhnq1zjYeDLnVeGpaqONhKpR2jWVeHNdy7jn8dS`);
}

const CMSHeader = req => {
  let token = '';
  if (window.localStorage.getItem('authToken')) {
    token = window.localStorage.getItem('authToken');
  }
  req.set('Authorization', token)
}

const getToken = () => {
  let token = '';
  if (window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
  }
  return token;
};

const CMSRequests = {
  auth: (url, body) =>
    superagent.post(`${CMS_API}${url}`, body).then(responseBody),
  post: (url, body) =>
    superagent.post(`${CMS_API}${url}`, body).use(CMSHeader).then(responseBody)
}

const requests = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  system: url =>
    superagent.get(`${DASHBOARD_API}${url}`).then(responseBody),
};

const nodeRequests = {
  get: url =>
    superagent.get(`${NODE_API_ROOT}${url}`).then(responseBody),
  post: (url, body) =>
    superagent.post(`${NODE_API_ROOT}${url}`, body).then(responseBody)
};

const foodmanduRequests = {
  get: url =>
    superagent.get(`${FOODMANDU_API_ROOT}${url}`).then(responseBody),
  getDelivery: url =>
    superagent.get(`${EK_DEVLIVERY_POINT}${url}`).then(responseBody),
  postDelivery: (url, body) =>
    superagent.post(`${EK_DEVLIVERY_POINT}${url}`, body).then(responseBody),
  post: (url, body) =>
    superagent.post(`${FOODMANDU_API_ROOT}${url}`, body).then(responseBody)
};

const tokenRequests = {
  get: url =>
    superagent.get(`${NODE_TOKEN_SERVER}${url}`).then(responseBody),
  post: (url, body) =>
    superagent.post(`${NODE_TOKEN_SERVER}${url}`, body).then(responseBody)
};

const compressRequests = {
  get: url =>
    superagent.get(`${COMPRESS_API}${url}`).end().then(responseBody),
  post: (url, body) =>
    superagent.post(`${COMPRESS_API}${url}`, body).then(responseBody)
};

const dashboardRequests = {
  get: url =>
    superagent.get(`${DASHBOARD_API}${url}`).set('key', `$2y$10$JVvyNgWiKuYqK/g6v0.rxe.MLUFJkZAlLm4gmFkrZto8b4yweUmka`).end().then(responseBody),
  post: (url, body) =>
    superagent.post(`${DASHBOARD_API}${url}`, body).set('key', `$2y$10$JVvyNgWiKuYqK/g6v0.rxe.MLUFJkZAlLm4gmFkrZto8b4yweUmka`).then(responseBody)
};

const locationRequests = {
  get: url =>
    superagent.get(`${LOCATION_API}${url}`).set('key', `$2y$10$wIkWbjfTfggsehNiQ/sKsetveaddle5BaGgRAOaXALnggkqH7/QUG`).end().then(responseBody),
};

const deliveryRequests = {
  get: url =>
    superagent.get(`${DELIVERY_API}${url}`).set('key', 'RwyKrA0hKr1KOZabXBB1c8PoJkgMu0PphVaHEFSjHuK5wfRq3a').end().then(responseBody),
  post: (url, body) =>
    superagent.get(`${DELIVERY_API}${url}`, body).set('key', 'RwyKrA0hKr1KOZabXBB1c8PoJkgMu0PphVaHEFSjHuK5wfRq3a').then(responseBody),
};

const bestRouteRequests = {
  getToken: url =>
    superagent.get(`${BESTROUTE_API}/auth/get-token`).set({ 'grant-type': 'client_credentials', 'client-id': 26, 'client-secret': 'wmh7KudZRzxlPk1FWctHu96EwTtJBmg5i5CcBodZ' }).end().then(responseBody),
  get: url =>
    superagent.get(`${BESTROUTE_API}${url}`).set('Authorization', `Bearer ${getToken()}`).end().then(responseBody),
  post: (url, body) =>
    superagent.post(`${BESTROUTE_API}${url}`, body).set('Authorization', `Bearer ${getToken()}`).then(responseBody),
  delete: (url, body) =>
    superagent.del(`${BESTROUTE_API}${url}`).set('Authorization', `Bearer ${getToken()}`).then(responseBody),
  put: (url, body) =>
    superagent.put(`${BESTROUTE_API}${url}`, body).set('Authorization', `Bearer ${getToken()}`).then(responseBody),
};


const Drivers = {
  get: slug =>
    foodmanduRequests.get(`/user/deliverystaffs`)
      .then(res => {
        return {
          drivers: res.data.delivery_staff.map(o => {
            o.deliveries = [];
            o.firstName = `${o.firstname} ${o.lastname}`;
            o.isChecked = true;
            o.id = String(o.id);
            o['imageName'] = "https://fmdelivery.koklass.com/backend/no-image.jpg";
            return o;
          }),

        }
      })
      .then(({ drivers }) => {
        return {
          drivers: drivers,
          deliveries: []
        }
      }),



  fmAuth: (body) =>
    fetch(`${EK_DEVLIVERY_POINT}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body
    })
      .then(res => res.json())
      .then(res => {
        return res.access_token
      })
      .catch(err => {
        throw (err);
      }),


  fetchDeliveryPoint: (id) => {
    return fetch(`${EK_DEVLIVERY_POINT}/api/order/riderorders?riderId=${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => { return res })
  },

  searchOrder: (id) => {
    return fetch(`${EK_DEVLIVERY_POINT}/api/order/tracker/orderdetails?order_number=${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => { return res })
  },


  getDevices: slug =>
    requests.system(`/client/device/skrfuejheb?key=$2y$10$JVvyNgWiKuYqK/g6v0.rxe.MLUFJkZAlLm4gmFkrZto8b4yweUmka`)
      .then(res => {
        res = res.data;
        return res.map(driver => {
          driver.isChecked = true;
          return driver;
        })
      })

};

const Trips = {
  getAllTrips: (start, end, userId) =>
    nodeRequests.get(`/trips?start=${start}&end=${end}&user_id=${userId}`)
      .then(res => {
        return res;
      }),
  getChartData: (slug, start, end) =>
    nodeRequests.get(`/charts?user_id=${slug}&start=${start}&end=${end}`)
      .then(res => {
        return res;
      }),
  mostVisited: (start, end, userId) =>
    nodeRequests.get(`/mostAreas?start=${start}&end=${end}&user_id=${userId}`)
      .then(res => {
        return res;
      }),
  nodePath: (slug, selectedDate) =>
    nodeRequests.get(`/nodePath?userid=${slug}&date=${selectedDate}`)
      .then(res => {
        return res;
      }),
  gpsPath: (slug, selectedDate) =>
    nodeRequests.get(`/gpsProcessedPath?userid=${slug}&date=${selectedDate}`)
      .then(res => {
        return res;
      }),
  getPath: (slug, selectedDate) =>
    compressRequests.get(`/getPath?userid=${slug}&date=${selectedDate} `)
      .then(res => {
        return res;
      }),

  getGpsPath: (slug, selectedDate) =>
    nodeRequests.get(`/gpsPath?id=${slug}&date=${selectedDate} `)
      .then(res => {
        return res;
      }),

  getGpsKM: (slug, start, end) =>
    nodeRequests.get(`/gpskm?user_id=${slug}&start=${start}&end=${end} `)
      .then(res => {
        return res;
      }),

  getCompressPath: (slug, selectedDate) =>
    // fetch(`${COMPRESS_API}/select?client=ek&id=${slug}&date=${selectedDate}&format=p``)
    fetch(`${COMPRESS_API}/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client": "ek",
        "id": "5187",
        "datetime": "2019-04-04",
        "format": "p",
        "key": "98e717a3701cf811a751d898063fdab1"
      }
    })
      .then(processChunkedResponse)
      .then(onChunkedResponseComplete)
      .catch(onChunkedResponseError),
  timeline: (slug, date) =>
    nodeRequests.get(`/timeline?user_id=${slug}&start=${date}&end=${date}`)
      .then(res => {
        return res;
      }),
  getPinPoint: (lat, lng) =>
    nodeRequests.get(`/pinpoint?lat=${lat}&lng=${lng}`)
      .then(res => {
        return res;
      }),
  getPerformace: (start, end, userId) =>
    nodeRequests.get(`/performance?start=${start}&end=${end}&user_id=${userId}`)
      .then(res => {
        return res;
      }),
  getProcessedPath: (slug, selectedDate) =>
    nodeRequests.get(`/getProcessedPath?userid=${slug}`)
      .then(res => {
        return res;
      }),
  getGpsTrip: (start, userId) =>
    nodeRequests.get(`/gpstrip?start=${start}&user_id=${userId}`)
      .then(res => {
        return res;
      }),
};



const onChunkedResponseComplete = (result) => {
  return JSON.parse(result)
}

const onChunkedResponseError = (err) => {
  console.error(err)
}

const processChunkedResponse = (response) => {
  let text = '';
  let reader = response.body.getReader()
  let decoder = new TextDecoder();

  return readChunk();

  function readChunk() {
    return reader.read().then(appendChunks);
  }

  function appendChunks(result) {
    var chunk = decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
    text += chunk;
    if (result.done) {
      return text;
    } else {
      return readChunk();
    }
  }
}


const Token = {
  get: userId =>
    tokenRequests.get(`/generateToken?user_id=${userId}`)
      .then(d => {
        return d.token
      })
};

// const Login = {
//   post: (data) => 
//     foodmanduRequests.postDelivery('/token',data)
//       .then(res => res)
// }
const Location = {
  location: (lat, lng) =>
    locationRequests.get(`/location-info?latitude=${lat}&longitude=${lng}`)
      .then(res => res),
}
const Dashboard = {
  dashboard: (data) =>
    dashboardRequests.get(`/dashboard?org=${data.org}&device=${data.device}&user=${data.user}&from=${data.start_date}&to=${data.end_date}`)
      .then(res => res),
  mostVisited: (data) =>
    dashboardRequests.get(`/mvb?org=${data.org}&device=${data.device}&user=${data.user}&from=${data.start_date}&to=${data.end_date}`),
  mostSpent: (data) =>
    dashboardRequests.get(`/mtsb?org=${data.org}&device=${data.device}&user=${data.user}&from=${data.start_date}&to=${data.end_date}`),
  pathData: (data) =>
    dashboardRequests.get(`/path-data?org=${data.org}&device=${data.device}&user=${data.user}&date=${data.date}`),
  userList: (data) =>
    dashboardRequests.get(`/user-list?org=${data.org}&device=${data.device}&from=${data.start_date}&to=${data.end_date}`),
  userSearchList: (data) =>
    dashboardRequests.get(`/user-list?org=${data.org}&device=${data.device}&user=${data.user}&from=${data.start_date}&to=${data.end_date}`),
  pathProperties: (data) =>
    dashboardRequests.get(`/path-properties?org=${data.org}&device=${data.device}&user=${data.user}&date=${data.date}`),
  chartData: (data) =>
    dashboardRequests.get(`/tor-chart?org=${data.org}&device=${data.device}&user=${data.user}&from=${data.start_date}&to=${data.end_date}`),
  tripData: (data) =>
    dashboardRequests.get(`/trip-data?org=skrfuejheb&device=${data.device}&user=${data.user}&date=${data.date}`)
}

const DriverStats = {
  get: () =>
    deliveryRequests.get('/merchantsdrivers')
      .then(response => {
        // console.log("withiyt", response)
        const normalizeData = normalize(response)
        // console.log("Normal", normalizeData)
        return {
          deliveries: Object.values(normalizeData.deliveryorganization).map(object =>
            build(normalizeData, 'deliveryorganization', object.id)
          ),
          drivers: response.data.map(object =>
            build(normalizeData, 'drivers', object.id)
          ),
        }
        
      })
      .then(({ deliveries, drivers }) => {
        // console.log("deliver", deliveries)
        // console.log("druver", drivers)

        let newDelivery = deliveries.map(delivery => {
          delivery['isChecked'] = true
          return delivery;
        })
        let newDriver = drivers.map(driver => {
          driver['isChecked'] = true;
          return driver
        })
        return {
          deliveries: newDelivery,
          drivers: newDriver
        };
      })
}

const checkError = async (res) => {
  if (res.errors) {
    let token = await BestRoute.getToken();
    window.localStorage.setItem('token', token.access_token)
    window.location.reload()
  }
  return res
}

const BestRoute = {
  getToken: () =>
    bestRouteRequests.getToken(),
  getArea: (type) =>
    bestRouteRequests.get(`/area/${type}`)
      .then(res => checkError(res)),
  createArea: (data) =>
    bestRouteRequests.post("/custom-area", data)
      .then(res => checkError(res)),
  deleteArea: (id) =>
    bestRouteRequests.delete(`/custom-area/${id}`)
      .then(res => checkError(res)),
  editArea: (id, data) =>
    bestRouteRequests.put(`/custom-area/${id}`, data)
      .then(res => checkError(res)),
  getStation: (id, type) =>
    bestRouteRequests.get(`/station-list?area_type=${type}&area_id=${id}`)
      .then(res => checkError(res)),
  getAllStation: (id, type) =>
    bestRouteRequests.get(`/station-list`)
      .then(res => checkError(res)),
  getDeliveryPoint: (date, shift, warehouse) => {
    if (date !== '') {
      return bestRouteRequests.get(`/order-delivery?date=${date}&shift=${shift}&warehouse=${warehouse}`)
        .then(res => checkError(res))
    } else {
      return { "data": [] }
    }
  },
  searchDeliveryPoint: (search) =>
    bestRouteRequests.get(`/order-delivery?keywords=${search}`)
      .then(res => checkError(res))
      .catch(err => err),
  getDashboardOrders: (dateFrom, dateTo) =>
    bestRouteRequests.get(`/order-delivery?date-from=${dateFrom}&&date-to=${dateTo}`)
      .then(res => checkError(res))
      .catch(err => err),
  vanList: () =>
    bestRouteRequests.get(`/van-list`)
      .then(res => checkError(res)),
  vanListByDate: (date) =>
    bestRouteRequests.get(`/van-list?date=${date}`)
      .then(res => checkError(res)),
  assignVan: (areaType, area, van) =>
    bestRouteRequests.get(`/manage-area/${areaType}?area_id=${area}&van_no=${van}`),
  routeList: (date, shift, warehouse) =>
    bestRouteRequests.get(`/route-list?date=${date}&shift=${shift}&warehouse=${warehouse}`)
      .then(res => checkError(res)),
  getAllRoute: () =>
    bestRouteRequests.get('/route')
      .then(res => checkError(res)),
  resetArea: (type, id) =>
    bestRouteRequests.get(`/reset-area/${type}?id=${id}`)
      .then(res => checkError(res)),
  assignVanToRoute: (route_id, van_id) =>
    bestRouteRequests.get(`/assign-van-to-route/${route_id}?vehicle_code=${van_id}`)
      .then(res => checkError(res)),
  moveOrderPosition: (position_id, route_id) =>
    bestRouteRequests.get(`/move-position?position_to=${position_id}&route_id=${route_id}`)
      .then(res => checkError(res)),
  assignOrderToRoute: (body) =>
    bestRouteRequests.post(`/assign-order-to-route`, body)
      .then(res => checkError(res)),
  removeOrderFromRoute: (body) =>
    bestRouteRequests.post('/remove-order-from-route', body)
      .then(res => checkError(res)),
  startAnalysis: (type, id, data, date, shift) =>
    bestRouteRequests.get(`/route-analysis?id=${id}&areatype=${type}&warehouse=${data}&date=${date}&shift=${shift}`)
      .then(res => checkError(res))
      .catch(err => err),
  reAnalysis: () =>
    bestRouteRequests.get(`/route-re-analysis`)
      .then(res => checkError(res))
      .catch(err => err),
  syncData: () =>
    bestRouteRequests.get(`/sync-data`)
      .then(res => checkError(res))
      .catch(err => err),
  routeReset: () =>
    bestRouteRequests.get('/reset-route ')
      .then(res => checkError(res))
      .catch(err => err),
  routeHistory: (date) =>
    bestRouteRequests.get(`/route-list-history?date=${date}`)
      .then(res => checkError(res))
      .catch(err => err),
  vanHistory: (date) =>
    bestRouteRequests.get(`/van-list-history?date=${date}`)
      .then(res => checkError(res))
      .catch(err => err),
  resetConfirmRoute: (id) =>
    bestRouteRequests.get(`/reset-confirm-route/${id}`)
      .then(res => checkError(res))
      .catch(err => err),
  assignVehicleToOrder: (body) =>
    bestRouteRequests.post('/assign-vehicle', body)
      .then(res => checkError(res))
      .catch(err => err),
  forecastGrid: () =>
    bestRouteRequests.get('/forecast-grid')
      .then(res => checkError(res))
      .catch(err => err),
  averageTime: (warehouse, startDate, endDate) =>
    bestRouteRequests.get(`/avg-order-time?warehouse=${warehouse}&&from-date=${startDate}&&to-date=${endDate}`)
      .then(res => checkError(res))
      .catch(err => err),
  averageVehicleTime: (vehicle_code, startDate, endDate) =>
    bestRouteRequests.get(`/avg-vehicle-order?vehicle_code=${vehicle_code}&&from-date=${startDate}&&to-date=${endDate}`)
      .then(res => checkError(res))
      .catch(err => err),

}

const CMS = {
  login: (body) =>
    CMSRequests.auth(`/auth/user/login`, body)
      .then(res => res),
  findUserByToken: (body) =>
    CMSRequests.post('auth/feUser-by-token', body)
      .then(res => res)
}

const NearestCMS = {
  nearest: (lat, lng) =>
    superagent.get(`https://trackingcms.boafresh.com/geolocation/nearby?lat=${lat}&lng=${lng}`)
      .then(res => res.body),
  offlineUser: () =>
    superagent.get(`https://trackingcms.boafresh.com/geolocation/recent`)
      .then(res => res.body)
}

export default {
  Drivers,
  DriverStats,
  Trips,
  Token,
  Dashboard,
  BestRoute,
  CMS,
  NearestCMS,
  Location,
};
