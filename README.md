## Table Component
### Props:
The TableComponent does not accept any props.

<img src="./src/assets/data.png" />

### Sorting:
To enable sorting, click on the table headers. The table can be sorted based on the following columns:
<img src="./src/assets/sort.png" />

Name
Description
Editions(s)
timeOfScreenshot
The sorting direction is indicated by an arrow icon displayed next to the column header.

### Filtering:
To filter the table data, enter a search term in the input field labeled "Filter by Edition." The table will be updated to show only the rows that match the entered search term in the edition name or description.
<img src="./src/assets/filter.png" />

### Loading Indicator:
While the data is being fetched from the API, a loading indicator will be displayed. Once the data is loaded, the table will be rendered.
<img src="./src/assets/load.png" />

### Empty Data Handling:
If no data is found or the filter criteria yield no results, a message will be displayed indicating that no data is found.
<img src="./src/assets/NoData.png" />

Credits:
The TableComponent is created by [https://github.com/traj3ctory].