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

Given /^a dashboard with id "(.*)" and name "(.*)" and monitors "(.*)"$/ do |dashboard_id, dashboard_name, monitor_ids|
  builder = Jashboard::DashboardBuilder.new.
    with_id(dashboard_id).
    with_name(dashboard_name)
  monitor_ids.split(",").each do |id|
    builder.with_monitor_id(id)
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

Given /^a jenkins build server at port (\d+) running the following builds$/ do |port, builds|
  builds.hashes.each do |build_data|
    @fake_server.add_handler("/job/#{build_data[:build_id]}/", build_data[:response_fixture])
  end
  @fake_server.start
end
