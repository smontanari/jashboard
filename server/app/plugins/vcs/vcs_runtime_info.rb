module Jashboard
  module Plugin
    module Vcs
      VcsRuntimeInfo = Struct.new(:revision_id, :date, :author, :message)
    end
  end
end
