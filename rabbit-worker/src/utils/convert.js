export function convert(payload, df, c) {
  const data = convertBaseOnDf(payload, df);
  return convertBaseOnClass(data, c);
}

function convertBaseOnClass(data, c) {
  const pp = [];
  for (const d of data) {
    let payload = { time: d.time };
    const data = d.data;
    switch (c) {
      case "Env":
        if (typeof data.temp == "number") {
          payload.temp = data.temp;
        }
        if (typeof data.hum == "number") {
          payload.hum = data.hum;
        }
        break;
      case "Acc":
        if (typeof data === "string") {
          const [x, y, z] = data.split(",").map((c) => +c);

          if (typeof x === "number" && !Number.isNaN(x)) {
            payload.x = x;
          }
          if (typeof y === "number" && !Number.isNaN(y)) {
            payload.y = y;
          }
          if (typeof z === "number" && !Number.isNaN(z)) {
            payload.z = z;
          }
        }
        break;
      case "Info":
        if (typeof data.text === "string") {
          payload.text = data.text;
        }
        if (typeof data.num === "number") {
          payload.num = data.num;
        }
        break;

      default:
        throw new Error("invalid class");
    }
    pp.push(payload);
  }
  return pp;
}

function convertBaseOnDf(payload, df) {
  switch (df) {
    case 0:
      // absolute time
      return absoluteTime(payload);
      break;
    case 1:
      // relative time
      return relativeTime(payload);
    case 2:
    default:
      // system time
      return systemTime(payload);
  }
}

// { time:Date , data: any }
function absoluteTime(payload) {
  return [{ data: payload.data, time: new Date(payload.time) }];
}

// { start: Date, sps: number, data: any[] }
function relativeTime(payload) {
  let { start, sps } = payload;
  start = new Date(start);
  const inc = 1000 / +sps;
  const r = [];
  for (const [i, d] of (payload.data ?? []).entries()) {
    r.push({
      time: new Date(start.getTime() + i * inc),
      data: d,
    });
  }
  return r;
}

//  { data: any }
function systemTime(payload) {
  return [{ data: payload.data, time: new Date() }];
}
