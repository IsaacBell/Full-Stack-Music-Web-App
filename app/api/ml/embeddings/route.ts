import { MLFeedback, insertMLFeedback, insertMLItemEmbedding, insertMLUserEmbedding, recommend } from "@/libs/gorseClient";
import { Date as Iso86Date } from "@/types";
import { Item, User } from "gorsejs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// example code - don't run in production!
const _demo = async () => {
  const date: string = new Date().toISOString();

  await insertMLUserEmbedding({UserId: 'bob', Labels: ['Rap', 'Techno']});

  await insertMLItemEmbedding({ ItemId: 'item1', Categories: ['Rap'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'item2', Categories: ['Rap', 'Gospel'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'item3', Categories: ['Country', 'Gospel'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'item4', Categories: ['Americana', 'Gospel'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'item5', Categories: ['Jazz', 'Rock'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'item6', Categories: ['Rap', 'Gospel'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'liked-item1', Categories: ['Rap'], IsHidden: false, Timestamp: date })
  await insertMLItemEmbedding({ ItemId: 'liked-item2', Categories: ['Gospel', 'Rap'], IsHidden: false, Timestamp: date })

  await insertMLFeedback([
    { FeedbackType: 'like', UserId: 'bob', ItemId: 'liked-item1', Timestamp: date },
    { FeedbackType: 'like', UserId: 'bob', ItemId: 'liked-item2', Timestamp: date },
  ])

  const res = await recommend('bob');
  console.log({res});
}

export async function POST(req: NextRequest, res: NextResponse) {    
  const json = await req.json();
  const { type, data } = json;

  if (!type)
    return new NextResponse(`Error: ${'err msg'}`, { status: 400 });

  let output;
  
  switch(type) {
    case 'user': 
      output = await insertMLUserEmbedding({...(data as User)});
      break;
    case 'item': 
      output = await insertMLItemEmbedding({...(data as Item)});
      break;
    case 'feedback': 
      output = await insertMLFeedback(data ?? []);
      break;
    default:
      output = '';
      break;
    }

    if (!output)
      return new NextResponse(`Error: ${'err msg'}`, { status: 400 });

  return NextResponse.json({ result: output }, { status: 200 });
}
