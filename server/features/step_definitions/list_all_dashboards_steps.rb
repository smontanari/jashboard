Given /^the following monitors$/ do |test_monitor_data|
  test_monitor_data.hashes.each do |monitor_data|
    configuration_hash = eval(monitor_data[:configuration])
    @db_helper.serialize_monitor(
      Jashboard::MonitorBuilder.new.
        with_id(monitor_data[:id]).
        with_name(monitor_data[:name]).
        with_type(monitor_data[:type]).
        with_refresh_interval(monitor_data[:refresh_interval].to_i).
        with_configuration(
          Jashboard::MonitorConfigurationHelper.send("create_#{monitor_data[:type]}_monitor_configuration", configuration_hash)
        ).build
    )
  end
end

Given /^a dashboard with id "(.*)" and name "(.*)" and monitors$/ do |dashboard_id, dashboard_name, monitor_ids|
  builder = Jashboard::DashboardBuilder.new.
    with_id(dashboard_id).
    with_name(dashboard_name)
  monitor_ids.cells_rows.each do |row|
    builder.with_monitor_id(row.first.value)
  end
  @db_helper.serialize_dashboard(builder.build)
end

Given /^a dashboard with id "(.*)" and name "(.*)" with no monitors$/ do |dashboard_id, dashboard_name|
  @db_helper.serialize_dashboard(
    Jashboard::DashboardBuilder.new.
      with_id(dashboard_id).
      with_name(dashboard_name).
      build
  )
end

When /^I request all the dashboard$/ do
  get "/ajax/dashboards"
end

Then /^the app should return the json response "(.*)"$/ do |fixture_path|
  last_response.should be_ok
  File.open("#{$JSON_FIXTURE_PATH}/#{fixture_path}") do |f|
    last_response.body.should be_json_eql f.read
  end
end

