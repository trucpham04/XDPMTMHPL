import { cn } from "@/lib/utils";
import { MessagesMainItemType } from "../../types/messages-sidebar-item-type";
import MessagesSection from "./message-section";

function MessagesMainContent({
  className,
  // messages,
  ...props
}: React.ComponentProps<"div">) {
  const messages: MessagesMainItemType[] = [
    {
      sender_id: 1,
      content: "Chào, sẵn sàng chưa? Hôm nay chúng ta sẽ leo núi đấy!",
      time: "06:00 AM",
    },
    {
      sender_id: 1,
      content: "Tôi cảm thấy rất hồi hộp và mong chờ chuyến đi này.",
      time: "06:02 AM",
    },
    {
      sender_id: 1,
      content: "Mình đã chuẩn bị xong, rất hào hứng cho cuộc phiêu lưu này.",
      time: "06:05 AM",
    },
    {
      sender_id: 2,
      content: "Không khí sáng nay thật trong lành, rất tuyệt vời!",
      time: "06:06 AM",
    },
    {
      sender_id: 2,
      content: "Chúng ta bắt đầu từ chân núi qua khu rừng xanh mát.",
      time: "06:10 AM",
    },
    {
      sender_id: 2,
      content: "Hãy cùng nhau khám phá từng bước đường phía trước.",
      time: "06:12 AM",
    },
    {
      sender_id: 2,
      content: "Đúng rồi, mình cũng háo hức tìm hiểu thiên nhiên xung quanh.",
      time: "06:15 AM",
    },
    {
      sender_id: 2,
      content: "Mình chụp vài bức ảnh để ghi lại khoảnh khắc đẹp.",
      time: "06:16 AM",
    },
    {
      sender_id: 1,
      content: "Dạo quanh, chúng ta thấy những cảnh vật thật hùng vĩ.",
      time: "06:20 AM",
    },
    {
      sender_id: 2,
      content: "Nhưng cũng cần lưu ý, hành trình leo núi không hề dễ dàng.",
      time: "06:25 AM",
    },
    {
      sender_id: 2,
      content:
        "Chúng ta cần cẩn thận với mỗi bước đi trên con đường gập ghềnh này.",
      time: "06:26 AM",
    },
    {
      sender_id: 1,
      content: "Đúng vậy, an toàn là ưu tiên hàng đầu.",
      time: "06:30 AM",
    },
    {
      sender_id: 1,
      content:
        "Giờ chúng ta dừng lại bên dòng suối nhỏ để uống nước và nghỉ ngơi.",
      time: "06:32 AM",
    },
    {
      sender_id: 2,
      content: "Cảm giác mát lành từ dòng suối giúp hồi phục sức lực.",
      time: "06:35 AM",
    },
    {
      sender_id: 1,
      content:
        "Tiếp tục cuộc hành trình, chúng ta bước qua những cánh đồng hoa dại.",
      time: "06:40 AM",
    },
    {
      sender_id: 1,
      content: "Màu sắc của hoa thật rực rỡ và sống động.",
      time: "06:41 AM",
    },
    {
      sender_id: 2,
      content: "Mình cảm nhận được niềm vui và sự tự do từ thiên nhiên.",
      time: "06:45 AM",
    },
    {
      sender_id: 2,
      content: "Đây là những khoảnh khắc không thể nào quên.",
      time: "06:46 AM",
    },
    {
      sender_id: 1,
      content: "Con đường bắt đầu trở nên gập ghềnh hơn khi leo lên dốc.",
      time: "06:50 AM",
    },
    {
      sender_id: 2,
      content: "Chúng ta cần tăng tốc một chút để không bị mỏi quá sớm.",
      time: "06:55 AM",
    },
    {
      sender_id: 2,
      content: "Hãy cùng nhau vượt qua những đoạn đường khó khăn này.",
      time: "06:57 AM",
    },
    {
      sender_id: 1,
      content: "Được rồi, cùng nhau tiến lên nào!",
      time: "07:00 AM",
    },
    {
      sender_id: 1,
      content: "Từng bước một, chúng ta tiến gần hơn đến đỉnh núi.",
      time: "07:02 AM",
    },
    {
      sender_id: 2,
      content: "Mình cảm thấy mệt nhưng tinh thần thì vẫn tràn đầy năng lượng.",
      time: "07:05 AM",
    },
    {
      sender_id: 2,
      content: "Thử thách này làm mình thêm tự tin về khả năng bản thân.",
      time: "07:06 AM",
    },
    {
      sender_id: 1,
      content: "Đỉnh núi hiện ra, thật gần rồi!",
      time: "07:10 AM",
    },
    {
      sender_id: 2,
      content: "Cảm giác sôi nổi khi được chạm tới thiên đường của núi rừng.",
      time: "07:15 AM",
    },
    {
      sender_id: 1,
      content: "Hãy dồn hết sức mình vào đoạn dốc cuối cùng.",
      time: "07:20 AM",
    },
    {
      sender_id: 1,
      content:
        "Mỗi bước đi đều là một chiến thắng nhỏ trên con đường chinh phục.",
      time: "07:22 AM",
    },
    {
      sender_id: 2,
      content: "Chắc chắn, cảm giác này thật đáng giá.",
      time: "07:25 AM",
    },
    {
      sender_id: 2,
      content: "Mình cảm thấy như mọi nỗ lực đều được đền đáp.",
      time: "07:26 AM",
    },
    {
      sender_id: 1,
      content: "Chúng ta đã đạt đến đỉnh núi, thành quả rực rỡ của hành trình!",
      time: "07:30 AM",
    },
    {
      sender_id: 1,
      content: "Cảnh vật từ đây thật hùng vĩ và đầy mê hoặc.",
      time: "07:32 AM",
    },
    {
      sender_id: 2,
      content:
        "Nhìn toàn cảnh núi non trùng điệp, mình cảm thấy thật nhỏ bé nhưng tự hào.",
      time: "07:35 AM",
    },
    {
      sender_id: 2,
      content: "Chúng ta nên dừng lại để chụp vài bức ảnh lưu niệm.",
      time: "07:36 AM",
    },
    {
      sender_id: 1,
      content: "Đúng vậy, những khoảnh khắc này rất đáng trân trọng.",
      time: "07:40 AM",
    },
    {
      sender_id: 2,
      content: "Hãy nghỉ ngơi và chia sẻ cảm nghĩ về chuyến đi.",
      time: "07:42 AM",
    },
    {
      sender_id: 1,
      content: "Tôi cảm thấy hạnh phúc khi được trải nghiệm cùng bạn.",
      time: "07:45 AM",
    },
    {
      sender_id: 1,
      content: "Mỗi bước đi, mỗi cảnh vật đều khiến tôi thêm yêu cuộc sống.",
      time: "07:46 AM",
    },
    {
      sender_id: 2,
      content: "Cùng nhau, mọi khó khăn trở nên nhẹ nhàng hơn.",
      time: "07:50 AM",
    },
    {
      sender_id: 2,
      content: "Giờ chúng ta hãy bắt đầu hành trình xuống núi.",
      time: "07:55 AM",
    },
    {
      sender_id: 1,
      content:
        "Cuộc hành trình xuống núi cũng mang đến những trải nghiệm khác biệt.",
      time: "08:00 AM",
    },
    {
      sender_id: 1,
      content: "Chúng ta đi qua những khu rừng rậm và những con suối mát lành.",
      time: "08:02 AM",
    },
    {
      sender_id: 2,
      content: "Tiếng suối róc rách như bản nhạc du dương, thật dễ chịu.",
      time: "08:05 AM",
    },
    {
      sender_id: 2,
      content:
        "Mỗi bước chân trên con đường xuống núi đều chứa đựng kỷ niệm quý giá.",
      time: "08:06 AM",
    },
    {
      sender_id: 1,
      content: "Cuối cùng, chúng ta đã gần về đến điểm xuất phát.",
      time: "08:10 AM",
    },
    {
      sender_id: 2,
      content: "Cảm ơn bạn vì một ngày leo núi đầy ý nghĩa!",
      time: "08:15 AM",
    },
    {
      sender_id: 1,
      content: "Chúc chuyến đi này luôn in đậm trong ký ức của chúng ta.",
      time: "08:18 AM",
    },
    {
      sender_id: 2,
      content: "Hy vọng chúng ta sẽ sớm có dịp leo núi cùng nhau lần nữa.",
      time: "08:20 AM",
    },
    {
      sender_id: 2,
      content:
        "Một ngày tuyệt vời, tràn đầy cảm hứng và những kỷ niệm khó phai.",
      time: "08:25 AM",
    },
  ];
  return (
    <>
      <div className={cn("flex flex-col gap-1", className)}>
        <MessagesSection messages={messages} />
      </div>
    </>
  );
}

export default MessagesMainContent;
