// @scripts
import Settings from "./Settings";

const ConversationDetails = ({
  convoSid,
  convo,
  participants
}) => {

  return (
    <div
      style={{
        minHeight: 65,
        maxHeight: 65,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: '#ebe9f1'
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}  
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            fontFamily: "fontFamilyText",
            fontSize: 16,
            color: "black",
            fontWeight: "bold",
            lineHeight: "1.2em",
            maxHeight: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"

          }}        
        >
          {convo.friendlyName ?? convoSid}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexBasis: 'auto',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              color: "black",
              fontFamily: "fontFamilyText",
              fontSize: 16,
              fontWeight: "bold",
              lineHeight: "1.2em",
              paddingRight: 16
            }}
          >
            {`${participants.length}`}
            {participants.length > 1 ? " participants" : " participant"}
          </div>
          <Settings convo={convo} participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default ConversationDetails;
