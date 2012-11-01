module Jashboard
  module Runtime
    BuildInfo = Struct.new(:last_build_time, :duration, :success, :status)
  end
end
