import React, { Component } from 'react'
import { debounce } from 'lodash'

import Card from '../../components/Card'
import Loading from '../../components/Loading'
import SearchInput from '../../components/SearchInput'
import QueryCityResults from '../../components/QueryCityResults'

import './styles.scss'

const url = 'https://www.metaweather.com/api/location/'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: 'san',
      citiesResult: [],
      isLoading: true,
    }
    this.debounceCitySearch = debounce(this.handleCitySearchQueryInput, 1000)
  }

  componentDidMount() {
    this.handleCitySearchQueryInput()
  }

  formatCityQueryResults = data => {
    return data.map(item => ({
      label: item.title,
      data: item,
    }))
  }

  handleChangeCityQueryInput = event => {
    // eslint-disable-next-line no-console
    // console.log(event)
    this.setState({ query: event.target.value, isLoading: true }, () => {
      this.debounceCitySearch(this.state.query)
    })
  }

  handleCitySearchQueryInput = async () => {
    /**
     * location sample
     * {
     *  latt_long: "37.777119, -122.41964"
     *  location_type: "City"
     *  title: "San Francisco"
     *  woeid: 2487956
     * }
     */

    const urlWithQuery = `https://cors-anywhere.herokuapp.com/${url}search/?query=${this.state.query}`
    try {
      const response = await fetch(urlWithQuery)
      if (response.ok) {
        const jsonResponse = await response.json()
        this.setState({
          isLoading: false,
          citiesResult: this.formatCityQueryResults(jsonResponse),
        })
      } else {
        // eslint-disable-next-line no-unused-expressions
        this.state.query === '' &&
          this.setState({ isLoading: false, citiesResult: [] })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }

  render() {
    const { citiesResult, isLoading, query } = this.state
    return (
      <div className="app">
        <div className="container">
          <Card>
            <h2>Simple Weather Application</h2>
            <hr />
            <div>
              <SearchInput
                name="cityInput"
                onChange={this.handleChangeCityQueryInput}
                value={query}
              />
            </div>
            <div>
              {isLoading ? (
                <Loading />
              ) : (
                <QueryCityResults data={citiesResult} />
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

export default App