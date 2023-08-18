import TripSearch from "@/Components/TripSearch";
import TripSearchResult from "@/Components/TripSearchResult";
import { ApiContext } from "@/Contexts/ApiContext";
import { ITripSearch } from "@/Services/ITrip";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Trips() {
  const api = useContext(ApiContext);

  const [queries, setQueries] = useSearchParams();

  const [url, setUrl] = useState(getUrlFirstTime());

  function getUrlFirstTime() {
    const sTime = queries.get("timeFrom");
    const eTime = queries.get("timeTo");

    const obj: ITripSearch = {
      startLocation: queries.get("startLocation") || "",
      endLocation: queries.get("endLocation") || "",
      timeFrom: sTime ? parseInt(sTime) : undefined,
      timeTo: eTime ? parseInt(eTime) : undefined,
    };

    return `${api}/trips/?${myCreateSearchParams(obj)}`;
  }

  function getUrl(query: URLSearchParams) {
    const url = `${api}/trips/?${query}`;
    console.log({ urlTrip: url });

    return url;
  }

  return (
    <div>
      <TripSearch
        onSearchParamChange={(q) => {
          setQueries(q);
          setUrl(getUrl(q));
        }}
      />
      <TripSearchResult url={url} />
    </div>
  );
}

export default Trips;
