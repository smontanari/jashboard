module Jashboard
  module Runtime
    BuildRuntimeInfo = Struct.new(:last_build_time, :duration, :success, :status)
  end
end
