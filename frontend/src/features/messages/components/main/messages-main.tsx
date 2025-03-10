import MessagesMainContent from "./messages-main-content";
import MessagesMainHeader from "./messages-main-header";
import MessagesMainInput from "./messages-main-input";

function MessagesMain({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div className="flex w-full flex-col">
        <MessagesMainHeader />
        <MessagesMainContent className="max-h-full flex-1 overflow-auto" />
        <MessagesMainInput />
      </div>
    </>
  );
}

export default MessagesMain;
