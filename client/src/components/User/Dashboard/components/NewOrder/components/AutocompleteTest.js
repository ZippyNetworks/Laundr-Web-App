import React from "react";
import MUIPlacesAutocomplete from "mui-places-autocomplete";

// the loader is also available on the GoogleMapReact class itself which makes it very weird to access, at least in typescript
// also this means the whole package must be included which is unfortunate if the autocomplete is in a different bundle

const googleMapLoader = require("google-map-react/lib/loaders/google_map_loader")
  .default;

class AutocompleteTest extends React.Component {
  state = {
    mounted: false,
  };

  componentDidMount = () => {
    if (!window.google) {
      googleMapLoader("key")
        .then((maps) => {
          // make api available globaly
          window.google = { maps };
          this.setState({ mounted: true });
        })
        .catch((error) => {
          console.error("AutoComplete", error);
        });
    } else {
      this.setState({ mounted: true });
    }
  };

  render() {
    if (this.state.mounted === false) {
      return <h1>loading</h1>;
    }

    // maps api is now globally available and can be used by `PlacesAutocomplete`
    return (
      <MUIPlacesAutocomplete
        onSuggestionSelected={() => {
          alert("ahh");
        }}
        renderTarget={() => <div />}
        textFieldProps={{
          variant: "outlined",
          fullWidth: true,
          label: "Street Address",
          autoComplete: "none",
        }}
      />
    );
  }
}

export default AutocompleteTest;
