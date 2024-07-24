export function validateClass(c) {
  const validList = ["Env", "Acc", "Info"];
  return validList.includes(c);
}

export async function validateSensor({ sensor_id, c, sensorModel }) {
  const [s] = (await sensorModel.readSensor({ uid: sensor_id })) ?? [];

  if (!s) {
    return { ok: false, message: "sensor uid is wrong" };
  }

  if (s.class !== c) {
    return { ok: false, message: "sensor class is wrong" };
  }

  return { ok: true };
}
