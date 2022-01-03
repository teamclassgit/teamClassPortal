// @packages
import { Badge } from "reactstrap";
import React from "react";

// @scripts
import Settings from "./Settings";

const ConversationDetails = ({
  convo,
  participants,
  conversation
}) => {
  return (
    <div
      style={{
        minHeight: 50,
        maxHeight: 50,
        marginBottom: 16,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: '#ebe9f1'
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: "calc(100% - 100px)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}  
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
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
          {conversation?.instructor?.name} & team
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
      <div 
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 8,
          minHeight: 65,
          textAlign: "initial",
          paddingTop: 14,
          maxHeight: 65,
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: '#ebe9f1'
        }} 
      >
        <Badge className="booking-checkout-summary-priceBadge">
          Coordinator and instructor
        </Badge>
      </div>
    </div>
  );
};

export default ConversationDetails;
