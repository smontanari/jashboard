module Jashboard
  module Plugin
    module Build
      BuildRuntimeInfo = Struct.new(:last_build_time, :duration, :success, :status)
    end
  end
end
