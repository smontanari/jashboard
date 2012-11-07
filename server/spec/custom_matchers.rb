RSpec::Matchers.define :a_monitor_with do |name, refresh_interval|
  match do |actual_monitor|
    actual % expected == 0
  end

  chain :of_type_build do
    @monitor_type = 1
  end
end
