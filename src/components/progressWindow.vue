<script>
export default {
  data() {
    return {};
  },
};
</script>
<template>
  <table class="d-flex flex-column">
    <tr class="d-flex flex-row  tab">
      <th>Model name</th>
      <th>Title</th>
      <th>Status</th>
    </tr> 
    <div class="tab2">
      <tr class="tab  d-flex flex-row">
        <td > 0 0</td>
        <td > title </td>
        <td>ok</td> 
      </tr>
    </div>
  </table>
</template>

<style>
.tab2{
  background-color: #f0eef0;
  width: 600px;
  border-radius: 15px; 
}
.tab{
  display: flex;
  justify-content: space-around;
}
.td-content {
  border-radius: 15px;
  width: 300px;
  background-color: #f0eef0;
  margin-left: 30px;
  justify-content: flex-start;
  display: flex;
}
</style>
