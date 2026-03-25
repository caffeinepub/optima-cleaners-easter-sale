import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";

actor {
  type QuoteRequest = {
    name : Text;
    email : Text;
    phone : Text;
    serviceType : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module QuoteRequest {
    public func compare(a : QuoteRequest, b : QuoteRequest) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let quotes = Map.empty<Text, QuoteRequest>();

  public shared ({ caller }) func submitQuoteRequest(
    id : Text,
    name : Text,
    email : Text,
    phone : Text,
    serviceType : Text,
    message : Text,
  ) : async () {
    let quoteRequest : QuoteRequest = {
      name;
      email;
      phone;
      serviceType;
      message;
      timestamp = Time.now();
    };
    quotes.add(id, quoteRequest);
  };

  public query ({ caller }) func getAllQuotes() : async [QuoteRequest] {
    quotes.values().toArray().sort();
  };
};
