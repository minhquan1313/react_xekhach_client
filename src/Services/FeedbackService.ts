import { IFeedback } from "@/Services/IFeedback";
import { fetcherPost } from "@/Services/fetcher";

interface IFeedbackDTO {
  ticketId: number;
  comment: string;
}

export const FeedbackService = {
  new: async ({
    comment,
    ticketId,
  }: IFeedbackDTO): Promise<IFeedback | boolean> => {
    const obj = {
      ticketId,
      comment,
    };

    console.log(obj);

    let result: IFeedback[] | undefined;
    try {
      result = await fetcherPost(obj)("/feedbacks/");
    } catch (error) {
      return false;
    }
    console.log(result);

    if (result) {
      const [item] = result;

      if (item) return item;
    }

    return false;
  },
};
