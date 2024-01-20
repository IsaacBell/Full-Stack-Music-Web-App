import { InfluxDB, ParameterizedQuery, Point } from '@influxdata/influxdb-client';

const token = process.env.INFLUXDB_TOKEN;
const org = 'iot'; // todo - changeme
const bucket = 'stems';

const client = new InfluxDB({
  url: process.env.INFLUXDB_URL ?? '', 
  token: token
});

type InfluxFieldType = 'number';

// example usage:
//   writeToInflux('mem', 'used_percent', 1.234);
export const writeToInflux = async (measurement: string, field: string, val: any, type_?: InfluxFieldType) => {
  const writeApi = client.getWriteApi(org, bucket);
  writeApi.useDefaultTags({ env: process.env.NODE_ENV });
  
  // todo - handle non-numeric types?
  const point = new Point(measurement).floatField(field, val);

  writeApi.writePoint(point);
  await writeApi.close();

  console.log(`influxdb:write - ${measurement} => ${field}=${val}`)
}

type TimeQueryRange = '365d' | '30d' | '14d' | '7d' | '1d' | '1h' | '30m' | '10m' | '5m' | '1m';

export const getSongPlayCount = async (songId: string, range: TimeQueryRange) => {
  const queryApi = client.getQueryApi(org);

  const query = `
    from(bucket: "${bucket}")
      |> range(start: -${range})
      |> filter(fn: (r) => r._measurement == "song_play")
      |> filter(fn: (r) => r.song_id == "${songId}")
      |> sum(column: "play_count")
  `;

  try {
    const result = await queryApi.collectRows<ParameterizedQuery>(query);
    
    if (result.length > 0) {
      console.log(`Total play count for song ${songId}: ${result?.[0]?.toString()}`);
      return result?.[0]?._value ?? result?.[0]?.toString();
    } else {
      console.log(`No plays found for song ${songId}`);
      return 0;
    }
  } catch (error) {
    console.error(`Error querying InfluxDB: ${error}`);
    throw error;
  }
}

export const countSongPlay = async (songId: string, userId: string) => {
  const writeApi = client.getWriteApi(org, 'song_play');
  writeApi.useDefaultTags({ env: process.env.NODE_ENV });

  const point = new Point('song_play')
    .tag('song_id', songId)
    .tag('user_id', userId)
    .intField('play_count', 1);

  writeApi.writePoint(point);
  await writeApi.close();
}

export const trackUserEngagement = async (userId: string, action: string) => {
  const writeApi = client.getWriteApi(org, bucket);
  writeApi.useDefaultTags({ env: process.env.NODE_ENV });

  const point = new Point('user_engagement')
    .tag('user_id', userId)
    .tag('action', action)
    .timestamp(new Date());

  writeApi.writePoint(point);
  await writeApi.close();
}

export const getUserEngagementStats = async (
  userId: string, 
  range: TimeQueryRange, 
  action?: string
): Promise<number | string> => {
  const queryApi = client.getQueryApi(org);

  let query = `
    from(bucket: "${bucket}")
      |> range(start: -${range})
      |> filter(fn: (r) => r._measurement == "user_engagement")
      |> filter(fn: (r) => r.user_id == "${userId}")
  `;

  if (action) {
    query += `|> filter(fn: (r) => r.action == "${action}")`;
  }

  query += ` |> count()`;

  try {
    const result = await queryApi.collectRows<ParameterizedQuery>(query);

    console.log(`User engagement stats for user ${userId}: ${result?.[0]?.toString()}`);
    return result?.[0]?._value ?? result?.[0]?.toString() ?? '';
  } catch (error) {
    console.error(`Error querying InfluxDB: ${error}`);
    throw error;
  }
}

export const trackSongSearch = async (userId: string, searchTerm: string) => {
  const writeApi = client.getWriteApi(org, bucket);
  writeApi.useDefaultTags({ env: process.env.NODE_ENV });

  const point = new Point('song_search')
    .tag('user_id', userId)
    .tag('search_term', searchTerm)
    .timestamp(new Date());

  writeApi.writePoint(point);
  await writeApi.close();
}

export const getSearchTermFrequency = async (
  searchTerm: string, 
  range: TimeQueryRange
): Promise<number | string> => {
  const queryApi = client.getQueryApi(org);

  const query = `
    from(bucket: "${bucket}")
      |> range(start: -${range})
      |> filter(fn: (r) => r._measurement == "song_search")
      |> filter(fn: (r) => r.search_term == "${searchTerm}")
      |> count()
  `;

  try {
    const result = await queryApi.collectRows<ParameterizedQuery>(query);

    console.log(`Search frequency for term "${searchTerm}": ${result?.[0]?.toString()}`);
    return result?.[0]?._value ?? result?.[0]?.toString() ?? '';
  } catch (error) {
    console.error(`Error querying InfluxDB: ${error}`);
    throw error;
  }
}

